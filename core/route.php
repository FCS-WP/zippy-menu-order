<?php

namespace ZIPPY_MENU_ORDER\Core;

if (! defined('ABSPATH')) exit;

use WP_REST_Server;

use ZIPPY_MENU_ORDER\App\Controllers\Products\Products;
use ZIPPY_MENU_ORDER\Core\Base_Request;


class Route
{

    protected static $namespace = MENU_ORDER_API_NAMESPACE;
    protected static $routes = [];
    protected static $currentMiddleware = [];
    protected static $groupPrefix = '';
    protected static $groupMiddleware = [];

    public static function namespace($namespace)
    {
        self::$namespace = $namespace;
    }

    public static function middleware($middleware)
    {
        // Allow single or array
        self::$currentMiddleware = is_array($middleware) ? $middleware : [$middleware];
        return new static;
    }

    public static function get($route, $controller, $permission_callback = null, $args = [])
    {
        self::addRoute(WP_REST_Server::READABLE, $route, $controller, $permission_callback, $args);
    }

    public static function post($route, $controller, $permission_callback = null, $args = [])
    {
        self::addRoute(WP_REST_Server::CREATABLE, $route, $controller, $permission_callback, $args);
    }

    public static function resource($resource, $controller, $middleware = [])
    {
        // index
        self::middleware($middleware)->get($resource, $controller . '@index');

        // show
        self::middleware($middleware)->get($resource . '/(?P<id>[\d]+)', $controller . '@show');

        // store
        self::middleware($middleware)->post($resource, $controller . '@store');

        // update (PUT + PATCH)
        self::middleware($middleware)->addRoute('PUT', $resource, $controller . '@update', null, []);
        self::middleware($middleware)->addRoute('PATCH', $resource, $controller . '@update', null, []);

        // destroy
        self::middleware($middleware)->addRoute('DELETE', $resource, $controller . '@destroy', null, []);
    }

    public static function group(array $options, callable $callback)
    {
        $previousPrefix = self::$groupPrefix;
        $previousMiddleware = self::$groupMiddleware;

        // Set new group prefix
        self::$groupPrefix = $options['prefix'] ?? self::$groupPrefix;

        // Set group middleware
        self::$groupMiddleware = $options['middleware'] ?? self::$groupMiddleware;

        // Run the callback to define routes in this group
        $callback();

        // Restore previous state
        self::$groupPrefix = $previousPrefix;
        self::$groupMiddleware = $previousMiddleware;
    }

    public static function addRoute($method, $route, $controller, $permission, $args)
    {
        $methodName = 'handle';

        if (is_string($controller) && str_contains($controller, '@')) {
            [$controller, $methodName] = explode('@', $controller);
        } elseif (is_array($controller) && count($controller) === 2) {
            [$controller, $methodName] = $controller;
        }

        // Apply group prefix
        if (!empty(self::$groupPrefix)) {
            $route = trim(self::$groupPrefix, '/') . '/' . trim($route, '/');
        }

        // Merge group middleware
        $middleware = array_merge(self::$groupMiddleware, self::$currentMiddleware);

        self::$routes[] = [
            'method'     => $method,
            'route'      => $route,
            'controller' => $controller,
            'methodName' => $methodName,
            'permission' => $permission,
            'middleware' => $middleware,
            'args'       => $args
        ];

        self::$currentMiddleware = [];
    }


    public static function register()
    {
        foreach (self::$routes as $r) {

            register_rest_route(
                self::$namespace,
                '/' . $r['route'],
                [
                    'methods'  => $r['method'],
                    'callback' => function ($request) use ($r) {
                        return self::dispatch($r, $request);
                    },
                    'permission_callback' => $r['permission'] ?: '__return_true',

                    'args' => $r['args']
                ]
            );
        }
    }

    private static function dispatch(array $r, $request)
    {

        // Middleware
        foreach ($r['middleware'] as $middlewareClass) {
            $middleware = new $middlewareClass();
            $response = $middleware->handle($request);
            if ($response !== true) {
                return $response;
            }
        }

        // Controller + DI
        $controller = new $r['controller'];
        return self::injectRequest($controller, $r['methodName'], $request);
    }


    private static function injectRequest($controller, $methodName, $request)
    {

        $ref  = new \ReflectionMethod($controller, $methodName);

        $params = $ref->getParameters();


        $resolved = [];

        foreach ($params as $param) {
            $type = $param->getType();

            if (!$type) {
                $resolved[] = null;
                continue;
            }

            $class = $type->getName();


            // If controller using Request Validation => Validate in Custom_Request
            if (is_subclass_of($class, Base_Request::class)) {
                $instance = new $class($request->get_params());

                $instance->setAction($methodName);
                $validated = $instance->validate();

                // if validate fail
                if ($validated !== true) {
                    return $validated; // return here, not allow to access Controller
                }

                $resolved[] = $instance;
                continue;
            }


            // If not using WP_REST_Request
            if ($class === \WP_REST_Request::class) {
                $resolved[] = $request;
                continue;
            }

            $resolved[] = null;
        }
        
        return $ref->invokeArgs($controller, $resolved);
    }
}

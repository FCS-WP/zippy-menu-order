<?php

namespace ZIPPY_MENU_ORDER\App\Middleware;

use WP_REST_Response;
use WP_REST_Request;

use ZIPPY_MENU_ORDER\Core\MiddlewareInterface;

class Auth_Middleware implements MiddlewareInterface
{

    public function handle(WP_REST_Request $request)
    {
        // if (!is_user_logged_in()) {
        //     return new WP_REST_Response([
        //         'status' => 'error',
        //         'message' => 'Authentication required'
        //     ], 401);
        // }

        return true;
    }
}

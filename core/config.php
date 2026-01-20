<?php

namespace ZIPPY_MENU_ORDER\Core;

defined('ABSPATH') || exit;

class Config
{
    protected static array $messages = [];

    public static function get(string $key, $default = null)
    {
        $segments = explode('.', $key);

        $file = array_shift($segments);

        if (!isset(self::$messages[$file])) {

            $path = ZIPPY_MENU_ORDER_DIR_PATH . "config/{$file}.php";

            if (file_exists($path)) {
                self::$messages[$file] = include $path;
            } else {
                self::$messages[$file] = [];
            }
        }

        $value = self::$messages[$file];

        // for each segments to find the config
        foreach ($segments as $segment) {
            if (is_array($value) && isset($value[$segment])) {
                $value = $value[$segment];
            } else {
                return $default;
            }
        }

        return $value;
    }

    public static function config(string $key, $default = null)
    {
        return self::get($key, $default);
    }

    public static function message(string $key = "", $default = null)
    {
        if (!empty($key)) {
            $key = "." . $key;
        }

        return self::config("api_message" . $key, $default);
    }
}

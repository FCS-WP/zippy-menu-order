<?php

namespace ZIPPY_MENU_ORDER\Src\Backend\Woocommerce\Products;

class Products
{
    protected static $_instance = null;
    public static function get_instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    private function __construct() {}
}

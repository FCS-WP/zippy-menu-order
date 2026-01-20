<?php

namespace ZIPPY_MENU_ORDER\Src\FrontEnd\Woocommerce\Accounts;

class Accounts
{
    protected static $_instance = null;
    public static function get_instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    private function __construct()
    {
        // add_filter('woocommerce_account_menu_items', array($this, 'add_custom_account_tab'), 10, 1);
    }
    // function add_custom_account_tab($items)
    // {
    //     $new_items = array();
    //     foreach ($items as $key => $value) {
    //         $new_items[$key] = $value;
    //         if ($key === 'orders') {
    //             $new_items['my-booking'] = 'My Booking';
    //         }
    //     }
    //     return $new_items;
    // }
}

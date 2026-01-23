<?php

namespace ZIPPY_MENU_ORDER\App\Controllers\Cart;

use ZIPPY_MENU_ORDER\App\Requests\Cart\Cart_Request;
use ZIPPY_MENU_ORDER\App\Services\Cart\Cart_Service;
use ZIPPY_MENU_ORDER\Core\Base_Controller;
use ZIPPY_MENU_ORDER\Core\Config;

class Cart_Controller extends Base_Controller
{
    public function __construct()
    {
        $this->messages = Config::message('store');
    }

    public function add_to_cart(Cart_Request $request)
    {
        try {
            $validated = $request->all();
            $data = Cart_Service::add_to_cart($validated);
            return $this->success($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}

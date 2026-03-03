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

    public function normal_add_to_cart(Cart_Request $request)
    {
        try {
            $validated = $request->all();
            $data = Cart_Service::normal_add_to_cart($validated);
            return $this->success($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function get_cart(Cart_Request $request)
    {
        try {
            $validated = $request->all();
            $data = Cart_Service::get_cart($validated);
            return $this->success($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function update_cart_item_qty(Cart_Request $request)
    {
        try {
            $validated = $request->all();
            $data = Cart_Service::update_qty($validated);
            return $this->success($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function remove_cart_item(Cart_Request $request)
    {
        try {
            $validated = $request->all();
            $data = Cart_Service::remove_item($validated);
            return $this->success($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function check_existing_cart(Cart_Request $request)
    {
        try {
            $validated = $request->all();
            $data = Cart_Service::is_has_cart($validated['store_id']);
            return $this->success($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function remove_current_cart(Cart_Request $request)
    {
        try {
            $validated = $request->all();
            $clear = Cart_Service::remove_current_cart($validated['store_id']);
            if ($clear) {
                $data = Cart_Service::get_cart();
                return $this->success($data);
            } else {
                return $this->error('Failed while remove cart');
            }
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}

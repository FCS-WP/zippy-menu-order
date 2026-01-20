<?php

namespace ZIPPY_MENU_ORDER\App\Controllers\Example;

use ZIPPY_MENU_ORDER\App\Models\Example\Example_Model;
use ZIPPY_MENU_ORDER\App\Requests\Example\Example_Request;
use ZIPPY_MENU_ORDER\Core\Base_Controller;
use ZIPPY_MENU_ORDER\Core\Config;

class Example_Controller extends Base_Controller
{
    public function __construct()
    {
        $this->messages = Config::message('example');
        $this->model = new Example_Model();
    }

    public function index(Example_Request $request)
    {
        try {
            return $this->success('success');
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function show(Example_Request $request)
    {
        try {
            return $this->success('success');
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function store(Example_Request $request)
    {
        try {
            return $this->success('success');
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function update(Example_Request $request)
    {
        try {
            return $this->success('success');
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function destroy(Example_Request $request)
    {
        try {
            return $this->success('success');
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}

<?php

namespace ZIPPY_MENU_ORDER\Core;

use WP_REST_Response;
use ZIPPY_MENU_ORDER\Utils\Request_Helper;
use ZIPPY_MENU_ORDER\Core\Config;

abstract class Base_Request
{
    protected $data;
    protected $validator;

    protected $action;

    protected $apiMessage;
    protected $commonApiMessage;

    public function __construct(array $data)
    {
        $this->data = $data;
        $this->apiMessage = Config::message();
        $this->commonApiMessage = $this->apiMessage['common'];
    }

    public function rules()
    {
        $method = $this->action . '_validate';

        if (method_exists($this, $method)) {
            return $this->{$method}();
        }

        return [];
    }

    public function messages()
    {
        return [];
    }

    public function validate()
    {
        $validation = Request_Helper::validate_request($this->data, $this->rules());

        if (is_wp_error($validation)) {
            return $validation;
        }

        return true;
    }

    public function all()
    {
        return $this->data;
    }

    public function setAction($action)
    {
        $this->action = $action;
    }
}

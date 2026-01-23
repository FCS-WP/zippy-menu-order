<?php

namespace ZIPPY_MENU_ORDER\App\Requests\Cart;

use ZIPPY_MENU_ORDER\Core\Base_Request;

class Cart_Request extends Base_Request
{
    protected $storeApiMessage;

    protected $postRules;
    public function __construct(array $data)
    {
        parent::__construct($data);
        $this->postRules = [];
    }

    public function add_to_cart_validate()
    {
        return [];
    }
}

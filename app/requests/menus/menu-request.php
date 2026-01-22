<?php

namespace ZIPPY_MENU_ORDER\App\Requests\Menus;

use ZIPPY_MENU_ORDER\Core\Base_Request;

class Menu_Request extends Base_Request
{

    protected $postRules;
    public function __construct(array $data)
    {
        parent::__construct($data);
        $this->postRules = [
            'name' => ['type' => 'string', 'required' => true],
            'description' => ['type' => 'string', 'required' => false],
            'min_pax' => ['type' => 'int', 'required' => true],
            'max_pax' => ['type' => 'int', 'required' => false],
            'price' => ['type' => 'float', 'required' => true],
            'dishes_qty' => ['type' => 'int', 'required' => true],
            'is_active' => ['type' => 'boolean', 'required' => true],
        ];
    }

    public function store_validate()
    {
        return $this->postRules;
    }

    public function show_validate()
    {
        return [
            'name' => ['type' => 'string', 'required' => true],
        ];
    }

    public function get_products_by_name_validate()
    {
        return [
            'q' => ['type' => 'string', 'required' => true],
        ];
    }

    public function get_addition_info_validate()
    {
        return [
            'product_id' =>  ['type' => 'int', 'required' => true],
        ];
    }

    public function update_validate()
    {
        $this->postRules['id'] =  ['type' => 'int', 'required' => true];
        return $this->postRules;
    }

    public function destroy_validate()
    {
        return [
            'id' => ['type' => 'int', 'required' => true],
        ];
    }

    public function messages()
    {
        return [];
    }
}

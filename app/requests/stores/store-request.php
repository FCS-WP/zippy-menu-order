<?php

namespace ZIPPY_MENU_ORDER\App\Requests\Stores;

use ZIPPY_MENU_ORDER\Core\Base_Request;

class Store_Request extends Base_Request
{
    protected $storeApiMessage;

    protected $postRules;
    public function __construct(array $data)
    {
        parent::__construct($data);
        $this->postRules = [];
    }

    public function store_validate()
    {
        return $this->postRules;
    }

    public function show_validate()
    {
        return [
            'id' => ['type' => 'int', 'required' => true],
        ];
    }

    public function update_validate()
    {
        $this->postRules['id'] = 'required|numeric';
        return $this->postRules;
    }

    public function destroy_validate()
    {
        return [
            'ids' => 'required|array',
            'ids.*' => 'required|numeric',
        ];
    }

    public function messages()
    {
        return [];
    }
}

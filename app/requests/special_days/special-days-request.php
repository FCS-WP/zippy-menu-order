<?php

namespace ZIPPY_MENU_ORDER\App\Requests\Special_Days;

use ZIPPY_MENU_ORDER\Core\Base_Request;

class Special_Days_Request extends Base_Request
{
    protected $storeApiMessage;

    protected $postRules;
    public function __construct(array $data)
    {
        parent::__construct($data);

        $this->storeApiMessage = $this->apiMessage['store'];
    }

    public function index_validate()
    {
        return [
            'store_id' => ['type' => 'int', 'required' => false],
        ];
    }

    public function store_validate()
    {
        return [];
    }

    public function update_validate()
    {
        return [];
    }

    public function destroy_validate()
    {
        return [
            'id' => 'required|numeric',
        ];
    }

    public function messages()
    {
        return [
            'ids' => $this->commonApiMessage['id_required'],
            'ids.*' => $this->commonApiMessage['id_number'],
            'id:required' => $this->commonApiMessage['id_required'],
            'name:required' => $this->storeApiMessage['name_required'],
            'default_capacity:numeric' => $this->storeApiMessage['default_capacity_numeric'],
            'coordinate.lat' => $this->storeApiMessage['not_valid_coordinate'],
            'coordinate.lng' => $this->storeApiMessage['not_valid_coordinate'],
            'active:required' => $this->commonApiMessage['active_required'],
            'active:boolean' => $this->commonApiMessage['active_boolean']
        ];
    }
}

<?php

namespace ZIPPY_MENU_ORDER\App\Requests\Example;

use ZIPPY_MENU_ORDER\Core\Base_Request;

class Example_Request extends Base_Request
{
    protected $exampleApiMessage;

    protected $postRules;
    public function __construct(array $data)
    {
        parent::__construct($data);

        $this->exampleApiMessage = $this->apiMessage['example'];

        $this->postRules = [
            // 'name' => 'required',
            // 'default_capacity' => 'numeric',
            // 'coordinate' => 'array',
            // 'coordinate.lat' => 'numeric|min:-90|max:90',
            // 'coordinate.lng' => 'numeric|min:-90|max:90',
            // 'active' => 'required|boolean'
        ];
    }

    public function store_validate()
    {
        return $this->postRules;
    }

    public function show_validate()
    {
        return [
            'id' => 'required|numeric',
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
        return [
            'ids' => $this->commonApiMessage['id_required'],
            'ids.*' => $this->commonApiMessage['id_number'],
            'id:required' => $this->commonApiMessage['id_required'],
            'name:required' => $this->exampleApiMessage['name_required'],
            'default_capacity:numeric' => $this->exampleApiMessage['default_capacity_numeric'],
            'coordinate.lat' => $this->exampleApiMessage['not_valid_coordinate'],
            'coordinate.lng' => $this->exampleApiMessage['not_valid_coordinate'],
            'active:required' => $this->commonApiMessage['active_required'],
            'active:boolean' => $this->commonApiMessage['active_boolean']
        ];
    }
}

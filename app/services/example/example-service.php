<?php

namespace ZIPPY_MENU_ORDER\App\Services\Example;

use ZIPPY_MENU_ORDER\App\Models\Example\Example_Model;

class Example_Service
{
    public static function checkStoreExist($id)
    {
        $store = Example_Model::find()
            ->where(['id' => $id])
            ->WhereNull('deleted_at')
            ->andWhere(['active' => 1])
            ->one();

        if (!$store) {
            return null;
        }

        return $store;
    }
}

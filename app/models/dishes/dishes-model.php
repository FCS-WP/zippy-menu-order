<?php

namespace ZIPPY_MENU_ORDER\App\Models\Dishes;

use ZIPPY_MENU_ORDER\App\Models\Menus\Dishes_Menu_Model;
use ZIPPY_MENU_ORDER\Core\Base_Model;

class Dishes_Model extends Base_Model
{
    public string $table;

    protected array $fillable = [
        // Define fillable fields here
        'product_id',
        'dishes_menu_id',
        'extra_price',
    ];

    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->table = DB_MENU_ORDER_PREFIX . 'dishes';
    }

    /**
     * DEFINE MODEL METHODS HERE
     */

    public static function get_dishes_from_menu($dishes_menu_id): array
    {
        return self::find()
            ->whereNull('deleted_at')
            ->andWhere('=', 'dishes_menu_id', $dishes_menu_id)
            ->asArray();
    }


    public function get_dishes_menus()
    {
        return $this->hasOne(Dishes_Menu_Model::class, 'id', 'dishes_menu_id');
    }


    public static function find_by_id($id): ?self
    {
        return self::find()
            ->where(['id' => $id])
            ->one();
    }

    public static function find_by_menu_id($id)
    {
        return self::find()
            ->where(['dishes_menu_id' => $id])
            ->all();
    }
}

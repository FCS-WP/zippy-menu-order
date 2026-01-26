<?php

namespace ZIPPY_MENU_ORDER\App\Models\Menus;

use ZIPPY_MENU_ORDER\App\Models\Dishes\Dishes_Model;
use ZIPPY_MENU_ORDER\Core\Base_Model;

class Dishes_Menu_Model extends Base_Model
{
    public string $table;

    protected array $fillable = [
        // Define fillable fields here
        'menu_id',
        'type',
        'name',
        'min_qty',
        'max_qty',
        'is_required',
    ];

    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->table = DB_MENU_ORDER_PREFIX . 'dishes_menus';
    }

    /**
     * DEFINE MODEL METHODS HERE
     */

    public static function get_all_menus($page, $limit): array
    {
        return self::find()
            ->whereNull('deleted_at')
            ->paginate($page, $limit);
    }

    public static function get_all_dishes_menus($menu_id, $type): array
    {
        if (!$type) {
            return self::find()
                ->whereNull('deleted_at')
                ->andWhere('=', 'menu_id', $menu_id)
                ->all();
        }
        return self::find()
            ->whereNull('deleted_at')
            ->andWhere('=', 'type', $type)
            ->all();
    }

    public function get_dishes()
    {
        return $this->hasMany(Dishes_Model::class, 'dishes_menu_id', 'id');
    }

    public static function find_by_id($id): ?self
    {
        return self::find()
            ->where(['id' => $id])
            ->one();
    }
}

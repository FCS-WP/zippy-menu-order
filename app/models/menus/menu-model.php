<?php

namespace ZIPPY_MENU_ORDER\App\Models\Menus;

use ZIPPY_MENU_ORDER\Core\Base_Model;

class Menu_Model extends Base_Model
{
    public string $table;

    protected array $fillable = [
        // Define fillable fields here
        'name',
        'description',
        'min_pax',
        'max_pax',
        'featured_img',
        'price',
        'dishes_qty',
        'is_active',
    ];

    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->table = DB_MENU_ORDER_PREFIX . 'menus';
    }

    /**
     * DEFINE MODEL METHODS HERE
     */

    public static function get_all_menus($page, $limit): array
    {
        return self::find()
            ->whereNull('deleted_at')
            ->andWhere('=', 'is_active', 1)
            ->paginate($page, $limit);
    }

    public function get_dishes_menus()
    {
        return $this->hasMany(Dishes_Menu_Model::class, 'menu_id', 'id');
    }

    public static function find_by_id($id): ?self
    {
        return self::find()
            ->where(['id' => $id])
            ->one();
    }
}

<?php

namespace ZIPPY_MENU_ORDER\App\Models\Dishes;

use ZIPPY_MENU_ORDER\Core\Base_Model;

class Dishes_Model extends Base_Model
{
    public string $table;
    const TABLE_NAME = 'dishes';

    protected array $fillable = [
        'product_id',
        'dishes_menu_id',
        'extra_price',
    ];

    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->table = DB_MENU_ORDER_PREFIX . self::TABLE_NAME;
    }

    public static function find_by_id(int $id): ?self
    {
        return self::find()
            ->where(['id' => $id])
            ->andWhere('IS NULL', 'deleted_at')
            ->one();
    }
}

<?php

namespace ZIPPY_MENU_ORDER\App\Models\Stores;

use ZIPPY_MENU_ORDER\App\Models\Special_Days\Special_Days_Model;
use ZIPPY_MENU_ORDER\Core\Base_Model;

class Store_Model extends Base_Model
{
    public string $table;

    protected array $fillable = [
        'name',
        'duration',
        'phone',
        'postal_code',
        'coordinate',
        'default_capacity',
        'active',
        'address',
        'max_booking_days',
    ];

    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->table = DB_MENU_ORDER_PREFIX . 'stores';
    }
    public static function get_stores($page, $limit): array
    {
        return self::find()
            ->whereNull('deleted_at')
            ->paginate($page, $limit);
    }

    public static function find_by_id($id): ?self
    {
        return self::find()
            ->where(['id' => $id])
            ->one();
    }

    public function mutateAttributes(array $data): array
    {
        if (isset($data['coordinate'])) {
            $data['coordinate'] = maybe_serialize($data['coordinate']);
        }
        return $data;
    }

    public function castAttributes(array $data): array
    {
        if (isset($data['coordinate'])) {
            $data['coordinate'] = maybe_unserialize($data['coordinate']);
        }
        return $data;
    }

    public function get_store_operations()
    {
        return $this->hasMany(Store_Operation_Model::class, 'store_id', 'id');
    }

    public function get_special_days()
    {
        return $this->hasMany(Special_Days_Model::class, 'store_id', 'id');
    }

    public static function get_all_stores(): array
    {
        return self::find()
            ->where(['active' => 1])
            ->whereNull('deleted_at')
            ->all();
    }
}

<?php

namespace ZIPPY_MENU_ORDER\App\Models\Stores;

use ZIPPY_MENU_ORDER\Core\Base_Model;

class Store_Operation_Model extends Base_Model
{
    public string $table;

    protected string $table_name = "store_operations";

    protected array $fillable = [
        'store_id',
        'day_of_week',
        'open_time',
        'end_time',
        'is_open',
    ];

    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->table = $this->db->prefix . STORES_OPERATION_TABLE;
        $this->table = DB_MENU_ORDER_PREFIX . $this->table_name;
    }

    public static function get_timeslots($store_id, $day_of_week): array
    {
        $query = self::find()
            ->select('so.id, so.store_id, s.default_capacity, so.day_of_week, so.open_time, so.end_time, so.created_at, so.updated_at')
            ->alias('so')
            ->innerJoin('fcs_data_stores as s', 's.id = so.store_id')
            ->andWhere(['s.id' => $store_id])
            ->andWhere(['so.day_of_week' => $day_of_week])
            ->orderBy('so.open_time', 'ASC');

        $results = $query->all();


        return !empty($results) ? $results : array();
    }

    public function find_time_slots($store_id, $day, $open_time, $end_time): ?self
    {
        $row = $this->db->get_row(
            $this->db->prepare(
                "SELECT id FROM {$this->table} WHERE store_id = %s AND open_time = %s AND end_time = %s AND day_of_week = %s AND deleted_at IS NULL LIMIT 1",
                $store_id,
                $open_time,
                $end_time,
                $day,
            ),
            ARRAY_A
        );

        if (!$row) {
            return null;
        }

        return new self($row);
    }

    public function find_time_slot_by_slot_id($store_id, $day, $slot_id): ?self
    {
        $row = $this->db->get_row(
            $this->db->prepare(
                "SELECT * FROM {$this->table} WHERE id = %s AND store_id = %s AND day_of_week = %s AND deleted_at IS NULL",
                $slot_id,
                $store_id,
                $day,
            ),
            ARRAY_A
        );

        if (!$row) {
            return null;
        }

        return new self($row);
    }


    public function get_store_slot_list($store_id, $day)
    {
        $row = $this->db->get_results(
            $this->db->prepare(
                "SELECT * FROM {$this->table} WHERE store_id = %s AND day_of_week = %s AND deleted_at IS NULL",
                $store_id,
                $day,
            ),
            ARRAY_A
        );

        if (!$row) {
            return null;
        }

        return new self($row);
    }

    public static function find_by_store_and_day($store_id, $day)
    {
        return self::find()
            ->andWhere(['store_id' => $store_id])
            ->andWhere(['day_of_week' => $day])
            ->all();
    }

    public static function find_by_store($store_id)
    {
        return self::find()
            ->andWhere(['store_id' => $store_id])
            ->where('IS NULL', 'deleted_at')
            ->all();
    }
}

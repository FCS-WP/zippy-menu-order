<?php

namespace ZIPPY_MENU_ORDER\App\Models\Special_Days;

use ZIPPY_MENU_ORDER\Core\Base_Model;

class Special_Days_Model extends Base_Model
{
    public string $table;
    const TABLE_NAME = 'special_days';

    protected array $fillable = [
        'store_id',
        'label',
        'date',
        'closed',
        'open_time',
        'close_time',
    ];

    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->table = DB_MENU_ORDER_PREFIX . self::TABLE_NAME;
    }

    /**
     * Find a special day by store_id and date
     *
     * @param int $store_id
     * @param string $date YYYY-MM-DD
     * @return array|null
     */
    public static function find_closed_date(int $store_id, string $date, $open_time = null, $close_time = null): ?self
    {
        return self::find()
            ->where(['store_id' => $store_id])
            ->andWhere(['date' => $date])
            ->andFilterWhere(['open_time' => $open_time])
            ->andFilterWhere(['close_time' => $close_time])
            ->one();
    }

    public static function get_all_as_array($store_id = null, $date = null): array
    {
        return self::find()
            ->where(['store_id' => $store_id])
            ->andFilterWhere(['date' => $date])
            ->orderBy('date', 'DESC')
            ->asArray();
    }

    public static function get_all($store_id = null, $date = null): array
    {
        return self::find()
            ->where(['store_id' => $store_id])
            ->andFilterWhere(['date' => $date])
            ->andWhere('IS NULL', 'deleted_at')
            ->orderBy('date', 'DESC')
            ->all();
    }

    public static function delete_by_id($id)
    {
        $special_day = self::find()
            ->where(['id' => $id])
            ->one();

        if (!$special_day) {
            return new \WP_Error('not_found', 'Special day not found');
        }

        return $special_day->softDelete();
    }
}

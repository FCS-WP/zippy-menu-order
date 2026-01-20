<?php

namespace ZIPPY_MENU_ORDER\App\Models\Example;

use ZIPPY_MENU_ORDER\Core\Base_Model;

class Example_Model extends Base_Model
{
    public string $table;

    protected array $fillable = [
        // Define fillable fields here
    ];

    public function __construct($data = [])
    {
        parent::__construct($data);
        // $this->table = DB_MENU_ORDER_PREFIX . 'stores';
    }

    /**
     * DEFINE MODEL METHODS HERE
     */

    // public static function get_stores($page, $limit): array
    // {
    //     return self::find()
    //         ->whereNull('deleted_at')
    //         ->paginate($page, $limit);
    // }
}

<?php

namespace ZIPPY_MENU_ORDER\Database\Migrations\Dishes;

use ZIPPY_MENU_ORDER\Core\Base_Migration;

class Dishes_Migration extends Base_Migration
{
    protected $version = '1.1';
    protected $stores_table;

    public function __construct()
    {
        parent::__construct();
        $this->table        = $this->prefix . DISHES_TABLE;
    }

    protected function get_sql()
    {
        return "CREATE TABLE {$this->table} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            product_id BIGINT UNSIGNED NOT NULL,
            dishes_menu_id BIGINT UNSIGNED NOT NULL,
            extra_price DECIMAL(10,2) NOT NULL DEFAULT 0,
            {$this->timestamps(true)},
            PRIMARY KEY (id),
            KEY product_id (product_id),
            KEY dishes_menu_id (dishes_menu_id),
            UNIQUE KEY unique_dish (product_id, dishes_menu_id)
        ) {$this->charset_collate};";
    }

    protected function after_up() {}

    public function down()
    {
        $this->drop($this->table);
    }
}

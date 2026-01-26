<?php

namespace ZIPPY_MENU_ORDER\Database\Migrations\Menus;

use ZIPPY_MENU_ORDER\Core\Base_Migration;

class Menus_Migration extends Base_Migration
{
    protected $version = '1.3';
    protected $stores_table;

    public function __construct()
    {
        parent::__construct();
        $this->table        = $this->prefix . MENUS_TABLE;
    }

    protected function get_sql()
    {
        return "CREATE TABLE {$this->table} (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        min_pax INT NOT NULL DEFAULT 1,
        max_pax INT NULL,
        featured_img TEXT NULL,
        dishes_qty INT NOT NULL DEFAULT 0,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        {$this->timestamps(true)},
        PRIMARY KEY (id),
        KEY is_active (is_active)
    ) {$this->charset_collate};";
    }

    protected function after_up() {}

    public function down()
    {
        $this->drop($this->table);
    }
}

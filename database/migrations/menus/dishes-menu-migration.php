<?php

namespace ZIPPY_MENU_ORDER\Database\Migrations\Menus;

use ZIPPY_MENU_ORDER\Core\Base_Migration;

class Dishes_Menu_Migration extends Base_Migration
{
    protected $version = '1.4';

    public function __construct()
    {
        parent::__construct();
        $this->table = $this->prefix . DISHES_MENU_TABLE;
    }

    protected function get_sql()
    {
        return "CREATE TABLE {$this->table} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            menu_id BIGINT UNSIGNED NOT NULL,
            type VARCHAR(50) NOT NULL,
            name VARCHAR(255) NOT NULL,
            min_qty INT NOT NULL DEFAULT 0,
            max_qty INT NOT NULL DEFAULT 0,
            is_required TINYINT(1) NOT NULL DEFAULT 1,
            {$this->timestamps(true)},
            PRIMARY KEY (id),
            KEY menu_id (menu_id)
        ) {$this->charset_collate};";
    }

    protected function after_up() {}

    public function down()
    {
        $this->drop($this->table);
    }
}

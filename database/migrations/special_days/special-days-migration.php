<?php

namespace ZIPPY_MENU_ORDER\Database\Migrations\Special_Days;

use ZIPPY_MENU_ORDER\Core\Base_Migration;

class Special_Days_Migration extends Base_Migration
{
    protected $version = '1.0';

    protected $stores_table;

    public function __construct()
    {
        parent::__construct();
        $this->table        = $this->prefix . SPECIAL_DAYS_TABLE;
        $this->stores_table = $this->prefix . STORES_TABLE;
    }

    protected function get_sql()
    {
        return "CREATE TABLE {$this->table} (
            id INT NOT NULL AUTO_INCREMENT,
            store_id INT NOT NULL,
            label VARCHAR(255) NULL,
            date DATE NULL,
            closed TINYINT(1) NULL,
            open_time TIME NULL,
            close_time TIME NULL,
            {$this->timestamps(true)},
            PRIMARY KEY (id),
            KEY store_id (store_id)
        ) {$this->charset_collate};";
    }

    public function down()
    {
        $this->drop($this->table);
    }
}

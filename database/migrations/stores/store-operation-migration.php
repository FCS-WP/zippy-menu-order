<?php

namespace ZIPPY_MENU_ORDER\Database\Migrations\Stores;

use ZIPPY_MENU_ORDER\Core\Base_Migration;

class Store_Operation_Migration extends Base_Migration
{
    protected $version = '1.0';
    protected $stores_table;

    public function __construct()
    {
        parent::__construct();
        $this->table        = $this->prefix . STORES_OPERATION_TABLE;
        $this->stores_table = $this->prefix . STORES_TABLE;
    }

    protected function get_sql()
    {
        return "CREATE TABLE {$this->table} (
            id INT NOT NULL AUTO_INCREMENT,
            store_id INT NOT NULL,
            day_of_week TINYINT(1) NOT NULL,
            open_time TIME NULL,
            end_time TIME NULL,
            is_open TINYINT(1) NULL,
            {$this->timestamps(true)},
            PRIMARY KEY (id),
            KEY store_id (store_id)
        ) {$this->charset_collate};";
    }

    protected function after_up()
    {
        $fkName = 'fk_store_operations_store';

        $exists = $this->db->get_var("
            SELECT CONSTRAINT_NAME
            FROM information_schema.TABLE_CONSTRAINTS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = '{$this->table}'
              AND CONSTRAINT_NAME = '{$fkName}'
        ");

        if ($exists) {
            return;
        }

        $this->db->query("
            ALTER TABLE {$this->table}
            ADD CONSTRAINT {$fkName}
            FOREIGN KEY (store_id)
            REFERENCES {$this->stores_table}(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        ");
    }

    public function down()
    {
        $this->drop($this->table);
    }
}

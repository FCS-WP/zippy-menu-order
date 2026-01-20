<?php

namespace ZIPPY_MENU_ORDER\Database\Migrations\Audit_Logs;

use ZIPPY_MENU_ORDER\Core\Base_Migration;

class Audit_Logs_Migration extends Base_Migration
{
    protected $version = '1.0';
    protected $stores_table;

    public function __construct()
    {
        parent::__construct();
        $this->table        = $this->prefix . AUDIT_LOGS_TABLE;
    }

    protected function get_sql()
    {
        return "CREATE TABLE {$this->table} (
        id INT NOT NULL AUTO_INCREMENT,
        action VARCHAR(255) NOT NULL,
        table_name VARCHAR(255) NOT NULL,
        record_id INT NOT NULL,
        old_values TEXT NULL,
        new_values TEXT NULL,
        {$this->timestamps(true)},
        PRIMARY KEY (id)
    ) {$this->charset_collate};";
    }
    protected function after_up() {}

    public function down()
    {
        $this->drop($this->table);
    }
}

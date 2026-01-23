<?php

namespace ZIPPY_MENU_ORDER\Database\Migrations\Stores;

use ZIPPY_MENU_ORDER\Core\Base_Migration;

class Store_Migration extends Base_Migration
{
    protected $version = '1.0';

    public function __construct()
    {
        parent::__construct();
        $this->table = $this->prefix . STORES_TABLE;
    }

    protected function get_sql()
    {
        return "CREATE TABLE {$this->table} (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        duration INT NULL,
        phone VARCHAR(255) NULL,
        postal_code VARCHAR(255) NULL,
        coordinate LONGTEXT NULL,
        default_capacity INT NULL,
        active TINYINT(1) DEFAULT 0 NOT NULL,
        test TINYINT(1) DEFAULT 0 NOT NULL,
        max_booking_days INT NULL,
        address VARCHAR(255) NULL,
        {$this->timestamps(true)},
        PRIMARY KEY (id)
    ) {$this->charset_collate}";
    }

    public function down()
    {
        $this->drop($this->table);
    }
}

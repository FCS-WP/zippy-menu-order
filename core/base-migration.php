<?php

namespace ZIPPY_MENU_ORDER\Core;

use Exception;

abstract class Base_Migration
{
    protected $db;
    protected $prefix;
    protected $charset_collate;
    protected $table;
    protected $version = '1.0';

    public function __construct()
    {
        global $wpdb;
        $this->db = $wpdb;
        $this->prefix = $wpdb->prefix;
        $this->charset_collate = $wpdb->get_charset_collate();
    }

    protected function version_option_key(): string
    {
        return 'ZIPPY_MENU_ORDER_migration_' . static::class;
    }

    protected function get_db_version()
    {
        return get_option($this->version_option_key());
    }

    protected function update_db_version()
    {
        update_option($this->version_option_key(), $this->version);
    }


    final public function migrate()
    {
        $dbVersion = $this->get_db_version();

        if (!$dbVersion || version_compare($dbVersion, $this->version, '<')) {
            $this->run_up();
            $this->after_up();
        }
    }

    protected function after_up() {}

    final protected function run_up()
    {
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        dbDelta($this->get_sql());

        $this->update_db_version();
    }

    protected function drop($table)
    {
        $this->db->query("DROP TABLE IF EXISTS {$table}");
        delete_option($this->version_option_key());
    }

    protected function timestamps($deletedAt = false)
    {
        $timestamps = "
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ";

        if ($deletedAt) {
            $timestamps .= ",
            deleted_at TIMESTAMP NULL";
        }

        return $timestamps;
    }

    abstract protected function get_sql();
    abstract public function down();
}

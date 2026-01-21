<?php

namespace ZIPPY_MENU_ORDER\Database\Migrations;

use ZIPPY_MENU_ORDER\Database\Migrations\Dishes\Dishes_Migration;
use ZIPPY_MENU_ORDER\Database\Migrations\Menus\Dishes_Menu_Migration;
use ZIPPY_MENU_ORDER\Database\Migrations\Menus\Menus_Migration;

class Migration_Manager
{
    protected static $_instance = null;

    public static function get_instance()
    {
        if (!self::$_instance) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    private function __construct()
    {
        add_action('admin_init', [$this, 'run']);
        register_activation_hook(ZIPPY_MENU_ORDER_BASENAME, [$this, 'run']);
        register_uninstall_hook(ZIPPY_MENU_ORDER_BASENAME, [self::class, 'runDown']);
    }

    public static function migrations()
    {
        return [
            new Menus_Migration(),
            new Dishes_Menu_Migration(),
            new Dishes_Migration(),
        ];
    }

    public static function run()
    {
        foreach (self::migrations() as $migration) {
            $class = get_class($migration);
            $migration->migrate();
        }
    }

    public static function runDown()
    {
        foreach (array_reverse(self::migrations()) as $migration) {
            $class = get_class($migration);
            echo "[MIGRATION] Dropping: {$class}\n";

            $migration->down();

            echo "[MIGRATION] Dropped: {$class}\n";
        }
    }
}

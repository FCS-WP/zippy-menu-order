<?php
/*
Plugin Name: Zippy Menu Order
Plugin URI: https://zippy.sg/
Description: Menu Order System
Version: 1.0 Author: Zippy SG
Author URI: https://zippy.sg/
License: GNU General Public
License v3.0 License
URI: https://zippy.sg/
Domain Path: /languages

Copyright 2025

*/

namespace ZIPPY_MENU_ORDER;


defined('ABSPATH') or die('°_°’');

/* --------------------------- Constants ------------------------------ */

/* Set plugin version constant. */

if (!defined('ZIPPY_MENU_ORDER_VERSION')) {
  define('ZIPPY_MENU_ORDER_VERSION', '1.0');
}

/* Set plugin name. */

if (!defined('ZIPPY_MENU_ORDER_NAME')) {
  define('ZIPPY_MENU_ORDER_NAME', 'Zippy Menu Order');
}

if (!defined('ZIPPY_MENU_ORDER_PREFIX')) {
  define('ZIPPY_MENU_ORDER_PREFIX', 'zippy_menu_order');
}

if (!defined('ZIPPY_MENU_ORDER_BASENAME')) {
  define('ZIPPY_MENU_ORDER_BASENAME', plugin_basename(__FILE__));
}

/* Set constant path to the plugin directory. */

if (!defined('ZIPPY_MENU_ORDER_DIR_PATH')) {
  define('ZIPPY_MENU_ORDER_DIR_PATH', plugin_dir_path(__FILE__));
}

/* Set constant url to the plugin directory. */

if (!defined('ZIPPY_MENU_ORDER_URL')) {
  define('ZIPPY_MENU_ORDER_URL', plugin_dir_url(__FILE__));
}

if (!defined('AUDIT_LOGS_TABLE')) {
  define('AUDIT_LOGS_TABLE', 'audit_logs');
}

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

/* --------------------------- Includes ------------------------------  */

require_once ZIPPY_MENU_ORDER_DIR_PATH . '/vendor/autoload.php';
require ZIPPY_MENU_ORDER_DIR_PATH . '/includes/autoload.php';
require ZIPPY_MENU_ORDER_DIR_PATH . '/includes/constants.php';

use ZIPPY_MENU_ORDER\Database\Migrations\Migration_Manager;
use ZIPPY_MENU_ORDER\Routes\Init_Route;
use ZIPPY_MENU_ORDER\Src\Backend\Backend_Setting;
use ZIPPY_MENU_ORDER\Src\Backend\Menus\Backend_Menus;
use ZIPPY_MENU_ORDER\Src\Emails\ZIPPY_MENU_ORDER_Emails;
use ZIPPY_MENU_ORDER\Src\FrontEnd\FrontEnd_Setting;
use ZIPPY_MENU_ORDER\Src\FrontEnd\Woocommerce\Accounts\Accounts;

/**
 *
 * Init Zippy Menu Order
 */

Init_Route::get_instance();
Backend_Menus::get_instance();
Backend_Setting::get_instance();
Migration_Manager::get_instance();
FrontEnd_Setting::get_instance();
Accounts::get_instance();
ZIPPY_MENU_ORDER_Emails::get_instance();

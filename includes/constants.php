<?php

/* Set plugin version constant. */

if (!defined('MENU_ORDER_API_NAMESPACE')) {
  define('MENU_ORDER_API_NAMESPACE', 'menu-order/v1');
}

if (!defined('MENU_ORDER_VERSION')) {
  define('MENU_ORDER_VERSION', '1.0.0');
}

if (!defined('DB_MENU_ORDER_PREFIX')) {
  global $wpdb;
  define('DB_MENU_ORDER_PREFIX', $wpdb->prefix);
}

if (!defined('MENUS_TABLE')) {
  define('MENUS_TABLE', 'menus');
}

if (!defined('DISHES_MENU_TABLE')) {
  define('DISHES_MENU_TABLE', 'dishes_menus');
}


if (!defined('DISHES_TABLE')) {
  define('DISHES_TABLE', 'dishes');
}

if (!defined('STORES_TABLE')) {
  define('STORES_TABLE', 'stores');
}

if (!defined('STORES_OPERATION_TABLE')) {
  define('STORES_OPERATION_TABLE', 'store_operations');
}

if (!defined('SPECIAL_DAYS_TABLE')) {
  define('SPECIAL_DAYS_TABLE', 'special_days');
}

if (!defined('STORE_ID')) {
  define('STORE_ID', 1);
}


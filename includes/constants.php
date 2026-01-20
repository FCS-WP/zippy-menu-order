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

<?php

namespace ZIPPY_MENU_ORDER\Routes;

use ZIPPY_MENU_ORDER\Core\Route;

class Init_Route
{
  protected static $_instance = null;


  /**
   * @return Init_Route
   */

  public static function get_instance()
  {
    if (is_null(self::$_instance)) {
      self::$_instance = new self();
    }
    return self::$_instance;
  }

  /**
   * Auto run & init function
   * @return void;
   */

  public function __construct()
  {
    add_action('rest_api_init', [$this, 'routes']);
  }

  /**
   * Each child class should define its own API routes here.
   *
   * @return void
   */
  public function routes()
  {

    foreach (glob(plugin_dir_path(__FILE__) . "/**/*.php") as $file_name) {

      require_once($file_name);
    }

    Route::register();
  }
}


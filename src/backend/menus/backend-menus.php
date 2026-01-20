<?php

namespace ZIPPY_MENU_ORDER\Src\Backend\Menus;

use ZIPPY_MENU_ORDER\Core\Views;

class Backend_Menus
{
  protected static $_instance = null;

  /**
   * @return Backend_Menus
   */

  public static function get_instance()
  {
    if (is_null(self::$_instance)) {
      self::$_instance = new self();
    }
    return self::$_instance;
  }

  private function __construct()
  {
    $this->init();
    add_action('admin_enqueue_scripts', [$this, 'build_admin_scripts_and_styles']);
  }

  function check_valid_screen()
  {
    // Screens where scripts should NOT load
    $valid_screens = [
      'credits',
    ];
    $current_page = isset($_GET['page']) ? sanitize_text_field($_GET['page']) : '';
    if (in_array($current_page, $valid_screens, true)) {
      return true; // Stop here
    }

    return false;
  }

  private function init()
  {
    $menus = [
      [
        'page_title' => 'Credits',
        'menu_title' => 'Credits',
        'menu_slug'  => 'credits',
        'callback'   => [$this, 'render_credits'],
        'icon'       => 'dashicons-calendar-alt',
        'position'   => 6,
        'submenus'   => [
          [
            'page_title' => 'Credit Settings',
            'menu_title' => 'Credit Settings',
            'menu_slug'  => 'credit_setttings',
            'callback'   => [$this, 'render_credit_settings'],
          ],
        ]
      ]
    ];

    new Views($menus);
  }


  public function render_credits()
  {
    echo '<div id="ZIPPY_MENU_ORDER"></div>';
  }

  public function render_credit_settings()
  {
    echo '<div id="credit_settings"></div>';
  }

  public function build_admin_scripts_and_styles()
  {
    $version = time();
    $current_user_id = get_current_user_id();
    $available_screen = $this->check_valid_screen();

    if ($available_screen) {
      wp_enqueue_style('menu-order-admin-styles', ZIPPY_MENU_ORDER_URL . 'assets/dist/css/admin.min.css', [], $version);
      // Pass the user ID to the script
      wp_enqueue_script('menu-order-admin-scripts', ZIPPY_MENU_ORDER_URL . 'assets/dist/js/admin.min.js', [], $version, true);

      wp_localize_script('menu-order-admin-scripts', 'admin_id', array(
        'userID' => $current_user_id,
      ));

      wp_localize_script('menu-order-admin-scripts', 'zippy_menu_order_api', array(
        'url' => esc_url_raw(rest_url(MENU_ORDER_API_NAMESPACE)),
        'nonce'  => wp_create_nonce('wp_rest'),
      ));
    }
  }
}

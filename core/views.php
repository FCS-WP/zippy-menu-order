<?php

namespace ZIPPY_MENU_ORDER\Core;

if (!defined('ABSPATH')) exit;

class Views
{
  private $menus = [];

  /**
   * Constructor
   * Accepts an array of menus to register
   */
  public function __construct(array $menus = [])
  {
    $this->menus = $menus;
    add_action('admin_menu', [$this, 'register_menus']);
  }

  /**
   * Register all menus
   */
  public function register_menus()
  {
    foreach ($this->menus as $menu) {
      $this->add_menu(
        $menu['page_title'] ?? 'No Title',
        $menu['menu_title'] ?? 'No Title',
        $menu['capability'] ?? 'manage_options',
        $menu['menu_slug'] ?? 'no-slug',
        $menu['callback'] ?? null,
        $menu['icon'] ?? 'dashicons-admin-generic',
        $menu['position'] ?? null,
        $menu['submenus'] ?? []  // Add SubMenu
      );
    }
  }

  /**
   * Add a single menu (and its submenus if provided)
   */
  public function add_menu(
    $page_title,
    $menu_title,
    $capability,
    $menu_slug,
    $callback,
    $icon,
    $position,
    $submenus = []
  ) {
    // Main Menu 
    add_menu_page(
      $page_title,
      $menu_title,
      $capability,
      $menu_slug,
      $callback,
      $icon,
      $position
    );

    // Sub Menu
    if (!empty($submenus)) {
      $this->create_submenu_page($submenus, $menu_slug, $capability);
    }
  }

  function create_submenu_page($submenus, $parent_slug, $capability)
  {
    foreach ($submenus as $submenu) {
      add_submenu_page(
        $parent_slug, // parent slug
        $submenu['page_title'] ?? 'Submenu',
        $submenu['menu_title'] ?? 'Submenu',
        $submenu['capability'] ?? $capability,
        $submenu['menu_slug'] ?? sanitize_title($submenu['menu_title'] ?? 'submenu'),
        $submenu['callback'] ?? null
      );

      if (isset($submenu['submenus'])) {
        $this->create_submenu_page($submenu['submenus'], $submenu['menu_slug'], $capability);
      }
    }
  }
}

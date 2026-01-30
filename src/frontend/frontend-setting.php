<?php

namespace ZIPPY_MENU_ORDER\Src\FrontEnd;

class FrontEnd_Setting
{
    protected static $_instance = null;

    /**
     * @return FrontEnd_Setting
     *
     *
     */

    public static function get_instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function __construct()
    {
        add_shortcode('order_form', [$this, 'register_order_form']);
        add_shortcode('menu_order_list', [$this, 'menu_order_list']);
        add_action('wp_enqueue_scripts', [$this, 'build_style_and_scripts'], 9999);
        register_activation_hook(ZIPPY_MENU_ORDER_BASENAME, [$this, 'create_order_pages']);
    }

    function register_order_form($atts)
    {
        return '<div id="frontend_order_form"></div>';
    }

    function menu_order_list($atts)
    {
        $atts = shortcode_atts(array(
            'menu_ids' => '',
        ), $atts, 'bartag');

        return '<div id="menu_order_list" data-menu_ids="' . $atts['menu_ids'] . '"></div>';
    }

    public function create_order_pages(): void
    {
        $pages = [
            [
                'title'   => 'Order Form',
                'slug'    => 'order-form',
                'content' => '[order_form]',
            ],
        ];

        foreach ($pages as $page) {
            $this->create_page_if_not_exists($page['title'], $page['slug'], $page['content']);
        }
    }

    /**
     * Create page if it does not already exist
     */
    function create_page_if_not_exists($title, $slug, $content = '')
    {

        // Check if page already exists by slug
        $page_exists = get_page_by_path($slug);

        if (!$page_exists) {
            $new_page = [
                'post_title'    => $title,
                'post_name'     => $slug,
                'post_content'  => $content,
                'post_status'   => 'publish',
                'post_type'     => 'page',
            ];

            wp_insert_post($new_page);
        }
    }

    function build_style_and_scripts()
    {
        $version = time();
        // $available_page = ['order-form', 'menus', 'my-account', 'store-list'];

        // $is_allowed =
        //     is_page($available_page) ||
        //     is_singular('product') ||
        //     (is_checkout() && is_wc_endpoint_url('order-pay'));

        // if (!$is_allowed) {
        //     return;
        // }

        // Remove theme bootstrap
        // $this->remove_all_default_styles();

        wp_enqueue_style('menu-order-web-styles', ZIPPY_MENU_ORDER_URL . 'assets/dist/css/web.min.css', [], $version);

        wp_enqueue_script('menu-order-web-scripts', ZIPPY_MENU_ORDER_URL . 'assets/dist/js/web.min.js', [], $version, true);
        wp_localize_script('menu-order-web-scripts', 'zippy_menu_order_api', array(
            'url'      => esc_url_raw(rest_url(MENU_ORDER_API_NAMESPACE)),
            'nonce'    => wp_create_nonce('wp_rest'),
            'timezone' => wp_timezone_string() ?: sprintf('%+03d:00', get_option('gmt_offset')),
        ));
    }
}

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
        // add_shortcode('booking_form', [$this, 'register_booking_form']);
        add_action('wp_enqueue_scripts', [$this, 'build_style_and_scripts'], 9999);
    }

    function build_style_and_scripts()
    {
        $version = time();
        $available_page = ['booking-form', 'my-account', 'store-list'];

        $is_allowed =
            is_page($available_page) ||
            is_singular('product') ||
            (is_checkout() && is_wc_endpoint_url('order-pay'));

        if (!$is_allowed) {
            return;
        }

        // Remove theme bootstrap
        // $this->remove_all_default_styles();

        wp_enqueue_style('credit-web-styles', ZIPPY_MENU_ORDER_URL . 'assets/dist/css/web.min.css', [], $version);

        wp_enqueue_script('credit-web-scripts', ZIPPY_MENU_ORDER_URL . 'assets/dist/js/web.min.js', [], $version, true);
        wp_localize_script('credit-web-scripts', 'zippy_menu_order_api', array(
            'url'      => esc_url_raw(rest_url(MENU_ORDER_API_NAMESPACE)),
            'nonce'    => wp_create_nonce('wp_rest'),
            'timezone' => wp_timezone_string() ?: sprintf('%+03d:00', get_option('gmt_offset')),
        ));
    }
}

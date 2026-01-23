<?

namespace ZIPPY_MENU_ORDER\Src\Backend;

class Backend_Setting
{
    protected static $_instance = null;

    /**
     * @return Backend_Setting
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
        add_action('admin_enqueue_scripts', array($this, 'remove_default_stylesheets'));
        add_action('admin_enqueue_scripts', array($this, 'add_google_charts'));
    }

    public function add_google_charts($hook)
    {
        if ($hook !== 'toplevel_page_bookings') {
            return;
        }

        // Google Charts CDN
        wp_enqueue_script(
            'google-charts',
            'https://www.gstatic.com/charts/loader.js',
            [],
            null,
            true
        );
    }

    public function remove_default_stylesheets($handle)
    {
        $apply_urls = [
            'toplevel_page_menu-orders',
            'menu-orders_page_menu-orders-setttings',
            'admin_page_single-menu-settings',
            'menu-orders_page_stores-settings',
        ];

        if (in_array($handle, $apply_urls)) {
            // Deregister the 'forms' stylesheet
            wp_deregister_style('forms');

            add_action('admin_head', function () {
                $admin_url = get_admin_url();
                $styles_to_load = [
                    'dashicons',
                    'admin-bar',
                    'common',
                    'admin-menu',
                    'dashboard',
                    'list-tables',
                    'edit',
                    'revisions',
                    'media',
                    'themes',
                    'about',
                    'nav-menus',
                    'wp-pointer',
                    'widgets',
                    'site-icon',
                    'l10n',
                    'buttons',
                    'wp-auth-check'
                ];

                $wp_version = get_bloginfo('version');

                // Generate the styles URL
                $styles_url = $admin_url . '/load-styles.php?c=0&dir=ltr&load=' . implode(',', $styles_to_load) . '&ver=' . $wp_version;


                // Enqueue the stylesheet
                echo '<link rel="stylesheet" href="' . esc_url($styles_url) . '" media="all">';
            });
        }
    }
}

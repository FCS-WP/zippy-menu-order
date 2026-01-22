<?php

namespace ZIPPY_MENU_ORDER\App\Services\Menus;

class Menu_Services
{
    public static function get_menus($name)
    {
        // $args = [
        //     'post_type'      => 'product',
        //     'post_status'    => 'publish',
        //     'posts_per_page' => -1,
        //     's'              => $name,
        // ];

        // $query = new \WP_Query($args);
        // $menus = [];

        // if ($query->have_posts()) {
        //     while ($query->have_posts()) {
        //         $query->the_post();
        //         $product = wc_get_product(get_the_ID());

        //         if (!$product) continue;

        //         $menus[] = [
        //             'id'          => $product->get_id(),
        //             'name'        => $product->get_name(),
        //             'status'      => $product->get_status(),
        //             'price'       => (float) $product->get_price(),
        //             'description' => wp_strip_all_tags($product->get_description()),
        //         ];
        //     }
        //     wp_reset_postdata();
        // }

        // return $products;
    }

    public static function get_menu_detail()
    {
       
    }
}

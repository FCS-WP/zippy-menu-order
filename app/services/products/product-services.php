<?php

namespace ZIPPY_MENU_ORDER\App\Services\Products;

class Product_Services
{
    public static function get_products_by_name($name)
    {
        $args = [
            'post_type'      => 'product',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            's'              => $name,
        ];

        $query = new \WP_Query($args);
        $products = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $product = wc_get_product(get_the_ID());

                if (!$product) continue;

                $products[] = [
                    'id'          => $product->get_id(),
                    'name'        => $product->get_name(),
                    'status'      => $product->get_status(),
                    'price'       => (float) $product->get_price(),
                    'description' => wp_strip_all_tags($product->get_description()),
                ];
            }
            wp_reset_postdata();
        }

        return $products;
    }

    public static function get_addition_info($product_id)
    {
        $result = [];

        //Get acf fields
        $checkbox = get_field_object('booking_checkbox', $product_id);
        $checkbox_label = $checkbox['label'];
        $checkbox_value = $checkbox['value'];

        $result['checkbox'] = [
            'label' => $checkbox_label,
            'value' => $checkbox_value,
        ];

        $ratio = get_field_object('booking_ratio', $product_id);
        $ratio_label = $ratio['label'];
        $ratio_value = $ratio['value'];

        $result['ratio'] = [
            'label' => $ratio_label,
            'value' => $ratio_value,
        ];

        return $result;
    }

    public static function get_product_categories()
    {        
        $terms = get_terms([
            'taxonomy'   => 'product_cat',
            'hide_empty' => false,
        ]);

        $categories = [];
        foreach ($terms as $term) {
            $categories[] = [
                'id'   => $term->term_id,
                'name' => $term->name,
                'slug' => $term->slug,
            ];
        }

        return $categories;
    }

    /**
     * Optimized + Cached: Get categories with products
     *
     * @return array
     */
    public static function get_products_and_categories()
    {
        $cache_key = 'custom_products_categories_v1';

        // 1 Try get cache first
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            return $cached;
        }

        // Get categories
        $terms = get_terms([
            'taxonomy'   => 'product_cat',
            'hide_empty' => false,
        ]);

        if (is_wp_error($terms) || empty($terms)) {
            return [];
        }

        $categories = [];
        foreach ($terms as $term) {
            $categories[$term->term_id] = [
                'id'       => $term->term_id,
                'name'     => $term->name,
                'slug'     => $term->slug,
                'products' => [],
            ];
        }

        // Get all products in ONE query
        $products = wc_get_products([
            'status' => 'publish',
            'limit'  => -1,
        ]);

        foreach ($products as $product) {
            $image_id = $product->get_image_id();

            $image_url = $image_id
                ? wp_get_attachment_image_url($image_id, 'woocommerce_thumbnail')
                : '';

            if (!$image_url) {
                $image_url = wc_placeholder_img_src();
            }

            $product_data = [
                'id'                => $product->get_id(),
                'name'              => $product->get_name(),
                'price'             => $product->get_price(),
                'stock'             => $product->get_stock_quantity(),
                'description'       => $product->get_description(),
                'short_description' => $product->get_short_description(),
                'add_to_cart'       => $product->is_purchasable(),
                'featured_image' => $image_url
            ];

            $product_terms = wp_get_post_terms(
                $product->get_id(),
                'product_cat',
                ['fields' => 'ids']
            );

            foreach ($product_terms as $term_id) {
                if (isset($categories[$term_id])) {
                    $categories[$term_id]['products'][] = $product_data;
                }
            }
        }

        $result = array_values($categories);

        // Save cache (1 hour)
        set_transient($cache_key, $result, HOUR_IN_SECONDS);

        return $result;
    }

    public static function clear_products_categories_cache()
    {
        delete_transient('custom_products_categories_v1');
    }
}

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
}

<?php
/**
 * Booking Created – Plain Text Email Template
 */

if (!defined('ABSPATH')) exit;

// Variables passed from email class:
// $booking_data, $email_heading, $email
extract($booking_data, EXTR_SKIP);

echo wp_strip_all_tags($email_heading) . "\n";
echo "--------------------------------------------------\n\n";

if (!empty($booking_data)) :

    // Customer greeting
    echo sprintf(__('Hi %s,', 'zippy'), $customer['name'] ?? '') . "\n\n";
    echo __('Thank you for your booking. Below are your booking details:', 'zippy') . "\n\n";

    // Booking Information
    echo "=== " . __('Booking Information', 'zippy') . " ===\n";
    echo __('Store:', 'zippy') . ' ' . ($store->name ?? '') . "\n";
    echo __('Booking Date:', 'zippy') . ' ' . ($slot->slot_date ?? '') . "\n";
    echo __('Booking Status:', 'zippy') . ' ' . wc_get_order_status_name($order->get_status()) . "\n";
    echo __('Start Time:', 'zippy') . ' ' . ($slot->open_time ?? '') . "\n";
    echo __('End Time:', 'zippy') . ' ' . ($slot->end_time ?? '') . "\n\n";

    // Booking Items
    echo "=== " . __('Booking Items', 'zippy') . " ===\n";

    foreach ($order->get_items() as $item_id => $item) :
        echo __('Service:', 'zippy') . ' ' . $item->get_name() . "\n";
        echo __('Number Of Slots:', 'zippy') . ' ' . $item->get_quantity() . "\n";
        echo __('Total:', 'zippy') . ' ' . wc_price($item->get_total()) . "\n";
        echo "------------------------\n";
    endforeach;

    echo "\n";

    // Booking Summary
    echo "=== " . __('Booking Summary', 'zippy') . " ===\n";

    foreach ($order->get_order_item_totals() as $key => $total) :
        echo wp_strip_all_tags($total['label']) . ' ' . wp_strip_all_tags($total['value']) . "\n";
    endforeach;

    echo "\n";

endif;

// Footer message
echo __('We look forward to serving you!', 'zippy') . "\n\n";

do_action('woocommerce_email_footer_text', $email);

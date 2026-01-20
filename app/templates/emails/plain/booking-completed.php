<?php
if (!defined('ABSPATH')) exit;

extract($booking_data, EXTR_SKIP);

echo "==============================\n";
echo wp_strip_all_tags($email_heading) . "\n";
echo "==============================\n\n";

echo sprintf(__('Hi %s,', 'zippy'), $customer['name'] ?? '') . "\n\n";
echo __('Your booking has been successfully completed!', 'zippy') . "\n\n";

echo __('Store:', 'zippy') . ' ' . ($store->name ?? '') . "\n";
echo __('Booking Date:', 'zippy') . ' ' . ($slot->slot_date ?? '') . "\n";
echo __('Start Time:', 'zippy') . ' ' . ($slot->open_time ?? '') . "\n";
echo __('End Time:', 'zippy') . ' ' . ($slot->end_time ?? '') . "\n\n";

echo "----- " . __('Order Items', 'zippy') . " -----\n";
foreach ($order->get_items() as $item) {
    echo $item->get_name() . ' x ' . $item->get_quantity() . ' — ' . wc_price($item->get_total()) . "\n";
}

echo "\n----- " . __('Totals', 'zippy') . " -----\n";
foreach ($order->get_order_item_totals() as $total) {
    echo wp_strip_all_tags($total['label']) . ': ' . wp_strip_all_tags($total['value']) . "\n";
}

echo "\n" . __('Thank you for choosing us!', 'zippy') . "\n";

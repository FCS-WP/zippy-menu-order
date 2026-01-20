<?php
if (!defined('ABSPATH')) exit;

extract($booking_data, EXTR_SKIP);

echo "==============================\n";
echo wp_strip_all_tags($email_heading) . "\n";
echo "==============================\n\n";

echo sprintf(__('Hi %s,', 'zippy'), $customer['name'] ?? '') . "\n\n";
echo __('Your booking has been cancelled. Here are the details:', 'zippy') . "\n\n";

echo __('Store:', 'zippy') . ' ' . ($store->name ?? '') . "\n";
echo __('Booking Date:', 'zippy') . ' ' . ($slot->slot_date ?? '') . "\n";
echo __('Start Time:', 'zippy') . ' ' . ($slot->open_time ?? '') . "\n";
echo __('End Time:', 'zippy') . ' ' . ($slot->end_time ?? '') . "\n";

echo "\n" . __('If this was a mistake, please contact support.', 'zippy') . "\n";

<?php

/**
 * Booking Created – HTML Email Template
 */

if (! defined('ABSPATH')) {
    exit;
}

// Variables passed from email class:
// $email_heading
// $booking_data
// $email

extract($booking_data, EXTR_SKIP);

do_action('woocommerce_email_header', $email_heading, $email);
?>

<?php if (! empty($booking_data)) : ?>
    <p><?php echo sprintf(__('Hi %s,', 'zippy'), $customer['name'] ?? ''); ?></p>

    <p><?php esc_html_e('Thank you for your booking. Below are your booking details:', 'zippy'); ?></p>

    <div style="margin-bottom: 20px;">
        <h2><?php esc_html_e('Booking Information', 'zippy'); ?></h2>

        <table cellspacing="0" cellpadding="6" border="1" style="width:100%; border-collapse:collapse; border:1px solid #eee;">
            <tbody>
                <tr>
                    <th style="background:#f8f8f8; padding:8px;"><?php esc_html_e('Store', 'zippy'); ?></th>
                    <td style="padding:8px;"><?php echo esc_html($store->name ?? ''); ?></td>
                </tr>
                <tr>
                    <th style="background:#f8f8f8; padding:8px;"><?php esc_html_e('Booking ID', 'zippy'); ?></th>
                    <td style="padding:8px;"><?php echo esc_html($booking->id ?? ''); ?></td>
                </tr>
                <tr>
                    <th style="background:#f8f8f8; padding:8px;"><?php esc_html_e('Booking Date', 'zippy'); ?></th>
                    <td style="padding:8px;"><?php echo esc_html($slot->slot_date ?? ''); ?></td>
                </tr>

                <tr>
                    <th style="background:#f8f8f8; padding:8px;"><?php esc_html_e('Booking Status', 'zippy'); ?></th>
                    <td style="padding:8px;"><?php echo esc_html(wc_get_order_status_name($order->get_status()) ?? ''); ?></td>
                </tr>

                <tr>
                    <th style="background:#f8f8f8; padding:8px;"><?php esc_html_e('Start Time', 'zippy'); ?></th>
                    <td style="padding:8px;"><?php echo esc_html($slot->open_time ?? ''); ?></td>
                </tr>

                <tr>
                    <th style="background:#f8f8f8; padding:8px;"><?php esc_html_e('End Time', 'zippy'); ?></th>
                    <td style="padding:8px;"><?php echo esc_html($slot->end_time ?? ''); ?></td>
                </tr>
            </tbody>
        </table>
    </div>


    <!-- Show Booking Items -->
    <div style="margin-bottom: 20px;">
        <h2><?php esc_html_e('Booking Items', 'zippy'); ?></h2>

        <table cellspacing="0" cellpadding="6" border="1" style="width:100%; border-collapse:collapse; border:1px solid #eee;">
            <thead>
                <tr>
                    <th style="background:#f8f8f8; padding:8px;"><?php esc_html_e('Service', 'zippy'); ?></th>
                    <th style="background:#f8f8f8; padding:8px;"><?php esc_html_e('Number Of Slots', 'zippy'); ?></th>
                    <th style="background:#f8f8f8; padding:8px;"><?php esc_html_e('Total', 'zippy'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($order->get_items() as $item_id => $item):
                    $product_name = $item->get_name();
                    $qty = $item->get_quantity();
                    $line_total = $item->get_total();
                ?>
                    <tr>
                        <td style="padding:8px;"><?php echo esc_html($product_name); ?></td>
                        <td style="padding:8px;"><?php echo esc_html($qty); ?></td>
                        <td style="padding:8px;"><?php echo wc_price($line_total); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <!-- Booking Summary -->
    <div style="margin-bottom: 20px;">
        <h2><?php esc_html_e('Booking Summary', 'zippy'); ?></h2>

        <table cellspacing="0" cellpadding="6" border="1" style="width:100%; border-collapse:collapse; border:1px solid #eee;">
            <tbody>
                <?php foreach ($order->get_order_item_totals() as $key => $total): ?>
                    <tr>
                        <th style="background:#f8f8f8; width:35%; padding:8px;">
                            <?php echo esc_html($total['label']); ?>
                        </th>
                        <td style="padding:8px;">
                            <?php echo wp_kses_post($total['value']); ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>


<?php endif; ?>

<p style="margin-top: 1rem;"><?php esc_html_e('We look forward to serving you!', 'zippy'); ?></p>

<?php
do_action('woocommerce_email_footer', $email);
?>
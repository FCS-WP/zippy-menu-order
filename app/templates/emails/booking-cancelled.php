<?php
/**
 * Booking Cancelled – HTML Email Template
 */

if (!defined('ABSPATH')) {
    exit;
}

extract($booking_data, EXTR_SKIP);

do_action('woocommerce_email_header', $email_heading, $email);
?>

<p><?php echo sprintf(__('Hi %s,', 'zippy'), $customer['name'] ?? ''); ?></p>

<p><?php esc_html_e('Your booking has been cancelled. Here are the details:', 'zippy'); ?></p>

<div style="margin-bottom: 20px;">
    <h2><?php esc_html_e('Booking Information', 'zippy'); ?></h2>

    <table cellspacing="0" cellpadding="6" border="1" style="width:100%; border-collapse:collapse;">
        <tbody>

            <tr>
                <th style="background:#f8f8f8; padding:8px;"><?php esc_html_e('Store', 'zippy'); ?></th>
                <td style="padding:8px;"><?php echo esc_html($store->name ?? ''); ?></td>
            </tr>

            <tr>
                <th style="background:#f8f8f8; padding:8px;"><?php esc_html_e('Booking Id', 'zippy'); ?></th>
                <td style="padding:8px;"><?php echo esc_html($booking->id ?? ''); ?></td>
            </tr>

            <tr>
                <th style="background:#f8f8f8; padding:8px;"><?php esc_html_e('Booking Date', 'zippy'); ?></th>
                <td style="padding:8px;"><?php echo esc_html($slot->slot_date ?? ''); ?></td>
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

<p><?php esc_html_e('If you believe this cancellation was a mistake, please contact our support team.', 'zippy'); ?></p>

<?php do_action('woocommerce_email_footer', $email); ?>

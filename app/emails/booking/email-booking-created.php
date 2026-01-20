<?php
namespace ZIPPY_MENU_ORDER\App\Emails\Booking;
use WC_Email;
if (!defined('ABSPATH')) exit;

class Email_Booking_Created extends WC_Email
{

    public function __construct()
    {
        $this->id          = 'email_booking_created';
        $this->title       = 'Booking Created';
        $this->description = 'Email sent when a new booking is created.';
        $this->heading     = 'New Booking Created';
        $this->subject     = 'A NEW BOOKING HAS BEEN CREATED';

        $this->template_html  = 'emails/booking-created.php';
        $this->template_plain = 'emails/plain/booking-created.php';

        $this->template_base  = ZIPPY_MENU_ORDER_DIR_PATH . '/app/templates/';

        add_action('email_booking_created', [$this, 'trigger'], 10, 2);

        parent::__construct();
    }

    public function trigger($booking_data)
    {
        if (!$booking_data) return;

        $this->object = $booking_data;

        $admin = get_option('admin_email');
        $customer = $booking_data['customer']['email'] ?? '';

        $recipients = array_filter([$admin, $customer]);

        $this->recipient = implode(',', $recipients);

        if (!$this->is_enabled() || !$this->get_recipient()) return;

        $this->send(
            $this->get_recipient(),
            $this->get_subject(),
            $this->get_content(),
            $this->get_headers(),
            $this->get_attachments()
        );
    }

    public function get_content_html()
    {
        return wc_get_template_html(
            $this->template_html,
            [
                'booking_data' => $this->object,
                'email_heading' => $this->heading,
                'email'         => $this
            ],
            '',
            $this->template_base
        );
    }

    public function get_content_plain()
    {
        return wc_get_template_html(
            $this->template_plain,
            [
                'booking_data' => $this->object,
                'email_heading' => $this->heading,
                'email'         => $this
            ],
            '',
            $this->template_base
        );
    }
}

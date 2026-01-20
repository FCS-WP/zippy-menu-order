<?php

namespace ZIPPY_MENU_ORDER\Src\Emails;

use ZIPPY_MENU_ORDER\App\Emails\Booking\Email_Booking_Created;

class ZIPPY_MENU_ORDER_Emails {
     protected static $_instance = null;

    /**
     * @return ZIPPY_MENU_ORDER_Emails
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
       add_filter('woocommerce_email_classes', [$this, 'init_email_classes']);
    }

    public function init_email_classes ($emails)
    {
        require_once ZIPPY_MENU_ORDER_DIR_PATH . '/app/emails/booking/email-booking-created.php';

        $emails['email_booking_created'] = new Email_Booking_Created();

        return $emails;
    }
}
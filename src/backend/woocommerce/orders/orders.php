<?php

namespace ZIPPY_MENU_ORDER\Src\Backend\Woocommerce\Orders;

use ZIPPY_MENU_ORDER\App\Models\Booking\Booking_Model;
use ZIPPY_MENU_ORDER\App\Models\Stores\Store_Model;
use ZIPPY_MENU_ORDER\App\Services\Booking\Booking_Services;
use ZIPPY_MENU_ORDER\App\Services\Timeslots\Timeslots_Services;

class Orders
{
  protected static $_instance = null;
  public static function get_instance()
  {
    if (is_null(self::$_instance)) {
      self::$_instance = new self();
    }
    return self::$_instance;
  }

  private function __construct() {}
}

<?php

namespace ZIPPY_MENU_ORDER\Core;

if (! defined('ABSPATH')) exit;

use WP_REST_Request;


interface MiddlewareInterface
{
  /**
   * Process the request
   * Return `true` to continue, or WP_REST_Response to stop request
   */
  public function handle(WP_REST_Request $request);
}

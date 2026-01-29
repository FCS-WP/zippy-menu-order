<?php

namespace ZIPPY_MENU_ORDER\App\Middleware;

use WP_REST_Request;

use WP_REST_Response;

use ZIPPY_MENU_ORDER\Core\MiddlewareInterface;

class Admin_Middleware implements MiddlewareInterface
{
  public function handle(WP_REST_Request $request)
  {
    // if (!current_user_can('manage_options')) {
    //   return new WP_REST_Response([
    //     'status' => 'error',
    //     'message' => 'Admin permissions required'
    //   ], 403);
    // }

    return true;
  }
}

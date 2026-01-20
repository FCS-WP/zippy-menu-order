<?php

namespace ZIPPY_MENU_ORDER\Core;

if (! defined('ABSPATH')) exit;

use WP_REST_Response;

class Base_Controller
{

  protected array $messages;
  protected object $model;
  protected function success($data = [], $status = 200)
  {
    return new WP_REST_Response([
      'status' => 'success',
      'data'   => $data
    ], $status);
  }

  protected function error($message, $status = 400)
  {
    return new WP_REST_Response([
      'status' => 'error',
      'message' => $message
    ], $status);
  }
}

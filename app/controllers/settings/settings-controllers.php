<?php

namespace ZIPPY_MENU_ORDER\App\Controllers\Settings;

use ZIPPY_MENU_ORDER\Core\Base_Controller;
use WP_REST_Request;

class Settings_Controllers extends Base_Controller
{
    public function index(WP_REST_Request $request)
    {
        return $this->success([
            'min_delivery_total' => (float) get_option(
                'zippy_min_delivery_total',
                defined('ZIPPY_MIN_DELIVERY_TOTAL') ? ZIPPY_MIN_DELIVERY_TOTAL : 40
            ),
        ], 200);
    }

    public function update(WP_REST_Request $request)
    {
        try {
            $params = $request->get_params();
            if (!isset($params['min_delivery_total'])) {
                return $this->error('min_delivery_total is required.');
            }
            $value = (float) $params['min_delivery_total'];
            if ($value < 0) {
                return $this->error('min_delivery_total must be zero or greater.');
            }
            update_option('zippy_min_delivery_total', $value);
            return $this->success([
                'min_delivery_total' => $value,
            ], 200);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}

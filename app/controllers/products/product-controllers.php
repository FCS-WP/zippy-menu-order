<?php

namespace ZIPPY_MENU_ORDER\App\Controllers\Products;

use ZIPPY_MENU_ORDER\Core\Base_Controller;
use ZIPPY_MENU_ORDER\Core\Base_Request;
use WP_REST_Response;
use WP_REST_Request;
use ZIPPY_MENU_ORDER\App\Requests\Products\Product_Request;
use ZIPPY_MENU_ORDER\App\Services\Products\Product_Services;

class Product_Controllers extends Base_Controller
{

	public function index(Product_Request $request)
	{

		return $this->success(['example' => 'data']);
	}

	public function show(Product_Request $request)
	{
		$validated = $request->all();

		// Validate input
		$name = $validated['name'] ?? null;
		$price = $validated['price'] ?? null;

		// $id = $request->get_param('price');
		return new WP_REST_Response(['single_product' => ['name' => $name, 'price' => $price]], 200);
	}

	public function store(Product_Request $request)
	{
		// Data is already validated
		$validated = $request->all();

		// $id = $request->get_param('price');
		return new WP_REST_Response(['single_product' => $validated], 200);
	}

	public function update(Product_Request $request)
	{
		$validated = $request->all();
		return new WP_REST_Response(['updated' => $validated], 200);
	}

	public function destroy(Product_Request $request)
	{
		$validated = $request->all();
		$id = $validated['id'] ?? null;
		return new WP_REST_Response(['deleted' => $id], 200);
	}

	public function get_products_by_name(Product_Request $request)
	{
		try {
			$validated = $request->all();
			$q = $validated['q'] ?? null;
			$products = Product_Services::get_products_by_name($q);
			return $this->success($products);
		} catch (\Exception $e) {
			return $this->error($e->getMessage());
		}
	}

	public function get_addition_info(Product_Request $request)
	{
		try {
			$validated = $request->all();
			$product_id = $validated['product_id'] ?? null;
			$info = Product_Services::get_addition_info($product_id);
			return $this->success($info);
		} catch (\Exception $e) {
			return $this->error($e->getMessage());
		}
	}

	public function get_product_categories(Product_Request $request)
	{
		try {
			$categories = Product_Services::get_product_categories();
			return $this->success($categories);
		} catch (\Exception $e) {
			return $this->error($e->getMessage());
		}
	}
}

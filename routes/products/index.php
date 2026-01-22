<?php

use ZIPPY_MENU_ORDER\App\Controllers\Products\Product_Controllers;
use ZIPPY_MENU_ORDER\Core\Route;
use ZIPPY_MENU_ORDER\App\Middleware\Auth_Middleware;
use ZIPPY_MENU_ORDER\App\Middleware\Admin_Middleware;

Route::resource('products', Product_Controllers::class);
Route::middleware([Auth_Middleware::class, Admin_Middleware::class])
    ->get('products/get-by-name', [Product_Controllers::class, 'get_products_by_name']);
Route::middleware([])
    ->get('products/get-addition-info', [Product_Controllers::class, 'get_addition_info']);
Route::middleware([Auth_Middleware::class, Admin_Middleware::class])
    ->get('products/get-categories', [Product_Controllers::class, 'get_product_categories']);

<?php

use ZIPPY_MENU_ORDER\Core\Route;
use ZIPPY_MENU_ORDER\App\Controllers\Stores\Store_Controller;
use ZIPPY_MENU_ORDER\App\Controllers\Stores\Store_Operation_Controller;
use ZIPPY_MENU_ORDER\App\Middleware\Auth_Middleware;
use ZIPPY_MENU_ORDER\App\Middleware\Admin_Middleware;

Route::resource('stores', Store_Controller::class);

Route::resource('operations', Store_Operation_Controller::class);

Route::middleware([])
    ->get('stores/get-all-stores', [Store_Controller::class, 'get_all_stores']);
Route::middleware([])
    ->get('stores/get-store-info', [Store_Controller::class, 'get_store_info']);

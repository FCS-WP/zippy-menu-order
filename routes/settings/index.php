<?php

use ZIPPY_MENU_ORDER\App\Controllers\Settings\Settings_Controllers;
use ZIPPY_MENU_ORDER\App\Middleware\Admin_Middleware;
use ZIPPY_MENU_ORDER\App\Middleware\Auth_Middleware;
use ZIPPY_MENU_ORDER\Core\Route;

Route::middleware([Auth_Middleware::class, Admin_Middleware::class])
    ->get('settings', [Settings_Controllers::class, 'index']);

Route::middleware([Auth_Middleware::class, Admin_Middleware::class])
    ->addRoute('PUT', 'settings', [Settings_Controllers::class, 'update'], null, []);

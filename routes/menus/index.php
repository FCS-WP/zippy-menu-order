<?php

use ZIPPY_MENU_ORDER\App\Controllers\Menus\Menu_Controllers;
use ZIPPY_MENU_ORDER\Core\Route;
use ZIPPY_MENU_ORDER\App\Middleware\Auth_Middleware;
use ZIPPY_MENU_ORDER\App\Middleware\Admin_Middleware;

Route::resource('menus', Menu_Controllers::class);
Route::middleware([Auth_Middleware::class, Admin_Middleware::class])
    ->post('menus/toggle-status', [Menu_Controllers::class, 'toggle_status']);
Route::middleware([Auth_Middleware::class, Admin_Middleware::class])
    ->get('menus/ids', [Menu_Controllers::class, 'get_menus_with_ids']);
// Route::middleware([])
//     ->get('Menus/get-addition-info', [Menu_Controllers::class, 'get_addition_info']);
// Route::middleware([Auth_Middleware::class, Admin_Middleware::class])
//     ->get('Menus/get-categories', [Menu_Controllers::class, 'get_Menu_categories']);

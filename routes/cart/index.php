<?php

use ZIPPY_MENU_ORDER\App\Controllers\Cart\Cart_Controller;
use ZIPPY_MENU_ORDER\Core\Route;

Route::middleware(middleware: [])
    ->post('cart/add-to-cart', [Cart_Controller::class, 'add_to_cart']);
Route::middleware(middleware: [])
    ->post('cart/normal-add-to-cart', [Cart_Controller::class, 'normal_add_to_cart']);
Route::middleware(middleware: [])
    ->post('cart/update-cart-item', [Cart_Controller::class, 'update_cart_item_qty']);
Route::middleware(middleware: [])
    ->post('cart/remove-cart-item', [Cart_Controller::class, 'remove_cart_item']);
Route::middleware(middleware: [])
    ->get('cart/cart-data', [Cart_Controller::class, 'get_cart']);

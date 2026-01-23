<?php

use ZIPPY_MENU_ORDER\App\Controllers\Cart\Cart_Controller;
use ZIPPY_MENU_ORDER\Core\Route;

Route::middleware(middleware: [])
    ->get('cart/add_to_cart', [Cart_Controller::class, 'add_to_cart']);

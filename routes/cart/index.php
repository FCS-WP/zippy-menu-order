<?php

use ZIPPY_MENU_ORDER\App\Controllers\Cart\Cart_Controller;
use ZIPPY_MENU_ORDER\Core\Route;

Route::middleware(middleware: [])
    ->post('cart/add-to-cart', [Cart_Controller::class, 'add_to_cart']);

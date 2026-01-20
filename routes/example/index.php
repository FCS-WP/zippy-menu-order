<?php

use ZIPPY_MENU_ORDER\App\Controllers\Example\Example_Controller;
use ZIPPY_MENU_ORDER\Core\Route;
use ZIPPY_MENU_ORDER\App\Controllers\Products\Products;

Route::get('example', [Example_Controller::class, 'index']);

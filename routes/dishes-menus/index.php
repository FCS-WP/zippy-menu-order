<?php

use ZIPPY_MENU_ORDER\App\Controllers\Menus\Dishes_Menu_Controllers;
use ZIPPY_MENU_ORDER\Core\Route;

Route::resource('dishes-menus', Dishes_Menu_Controllers::class);


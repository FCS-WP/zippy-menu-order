<?php

use ZIPPY_MENU_ORDER\App\Controllers\Special_Days\Special_Days_Controllers;
use ZIPPY_MENU_ORDER\Core\Route;

Route::resource('special-days', Special_Days_Controllers::class);

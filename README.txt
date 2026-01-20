=== ROUTE ===

1. Use single style

Route::get('products', [Products::class , 'index'])

2. Resources

Route::resource('products', Products_Controller::class)

// GET    /products         -> Products::index
// GET    /products/{id}    -> Products::show
// POST   /products         -> Products::store
// PUT    /products/{id}    -> Products::update
// PATCH  /products/{id}    -> Products::update
// DELETE /products/{id}    -> Products::destroy


3. Add middleware

// Single route
Route::middleware(Auth_Middleware::class)
    ->get('products', [Products::class, 'index']);

// Resource route
Route::resource('products', Products::class, [Auth_Middleware::class, Admin_Middleware::class]);

4. Group

Route::group([
  'prefix' => 'admin',
  'middleware' => [Auth_Middleware::class, Admin_Middleware::class]
], function () {
  Route::resource('products', Products::class);
  Route::get('dashboard', [Products::class, 'dashboard']);
});

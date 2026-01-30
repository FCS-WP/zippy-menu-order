export const validateMenuSelection = (dishesMenus, selectedDishes) => {
    console.log("Check", dishesMenus);
    console.log("Selected", selectedDishes);
  const errors = [];
  const selectedSet = new Set(selectedDishes.map(Number));

  dishesMenus.forEach(menu => {
    const minQty = Number(menu.min_qty || 0);
    const maxQty = Number(menu.max_qty || 0);
    const isRequired = Number(menu.is_required) === 1;

    // Count selected dishes in this menu
    const count = menu.dishes.reduce((total, dish) => {
      return total + (selectedSet.has(Number(dish.id)) ? 1 : 0);
    }, 0);

    // Rule 1: required
    if (isRequired && count === 0) {
      errors.push(`${menu.name} is required`);
    }

    // Rule 2: min qty
    if (minQty > 0 && count < minQty) {
      errors.push(`${menu.name} requires at least ${minQty} items`);
    }

    // Rule 3: max qty
    if (maxQty > 0 && count > maxQty) {
      errors.push(`${menu.name} allows maximum ${maxQty} items`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};
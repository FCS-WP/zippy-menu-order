import React, { useEffect, useState } from "react";
import { useFetchMenu } from "../../../hooks/useFetchMenus";
import { useOrderFormProvider } from "../../../providers/OrderFormProvider";
import { useFetchStore } from "../../../hooks/useFetchStore";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { format as formatDate } from "date-fns";
import DishesMenus from "../../order-form/DishesMenus";
import { data } from "autoprefixer";
import { orderApi } from "../../../api";
import { toast } from "react-toastify";
import { validateMenuSelection } from "../../../helpers/order-helpers";

const OrderForm = () => {
  const menuId =
    new URLSearchParams(window.location.search).get("menu_id") || "";
  const { menuData, storeData, updateState, ...data } = useOrderFormProvider();
  const { currentMenu, fetchMenuDetail } = useFetchMenu();
  const { operations, fetchOperations } = useFetchStore();

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedAddonsItems, setSelectedAddonsItems] = useState([]);
  const [numberOfPax, setNumberOfPax] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [excludeDates, setExcludeDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [orderStep, setOrderStep] = useState(1);
  const [mainDishesMenu, setMainDishesMenu] = useState([]);
  const [addonsDishesMenu, setAddonsDishesMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const COURSES_REQUIRED = parseInt(currentMenu?.dishes_qty);
  const GST_RATE = currentMenu?.gst_rate
    ? parseFloat(currentMenu?.gst_rate)
    : 0;

  const handleItemToggle = (itemId, type = "main") => {
    if (type == "main") {
      if (selectedItems.includes(itemId)) {
        setSelectedItems(selectedItems.filter((id) => id !== itemId));
      } else {
        if (selectedItems.length < COURSES_REQUIRED) {
          setSelectedItems([...selectedItems, itemId]);
        }
      }
    } else {
      if (selectedAddonsItems.includes(itemId)) {
        setSelectedAddonsItems(
          selectedAddonsItems.filter((id) => id !== itemId),
        );
      } else {
        setSelectedAddonsItems([...selectedAddonsItems, itemId]);
      }
    }
  };

  const handlePaxChange = (increment) => {
    const newPax = numberOfPax + increment;
    if (newPax >= currentMenu.min_pax) {
      setNumberOfPax(newPax);
    }
  };

  const getTotalExtraPrices = (arr) => {
    if (arr.length == 0) return 0;
    const result = arr.reduce((total, itemId) => {
      const item = currentMenu.dishes_menus
        .flatMap((menu) => menu.dishes)
        .find((i) => parseInt(i.id) === parseInt(itemId));
      return total + (item ? parseFloat(item.extra_price) * numberOfPax : 0);
    }, 0);
    return result;
  };

  const calculatePrice = () => {
    if (!currentMenu) return 0;
    const basePrice = parseFloat(currentMenu?.price) * numberOfPax;
    const additionalPrice = getTotalExtraPrices(selectedItems);
    const addonsExtraPrice = getTotalExtraPrices(selectedAddonsItems);

    return basePrice + additionalPrice + addonsExtraPrice;
  };

  const price = calculatePrice();
  const totalWithGST = price * (1 + GST_RATE);

  useEffect(() => {
    fetchMenuDetail(menuId);
    fetchOperations(1);
  }, []);

  useEffect(() => {
    if (currentMenu) {
      updateState({ menuData: currentMenu });
      setNumberOfPax(parseInt(currentMenu.min_pax));
      seprateMenusByType(currentMenu.dishes_menus);
    }
  }, [currentMenu]);

  useEffect(() => {
    if (operations) {
      updateState({ operationsData: operations });
    }
    handleExcludeDate();
  }, [operations]);

  const handleExcludeDate = (date) => {
    let excludes = [];
    operations?.special_days?.map((item) => {
      if (item.closed == true) {
        excludes.push(new Date(item.date));
      }
    });
    setExcludeDates(excludes);
  };

  const handleChooseDate = (date) => {
    setDeliveryDate(date);
    triggerHandleSlots(date);
  };

  const triggerHandleSlots = (date) => {
    if (!operations || operations.days.length == 0) return;
    const dateData = operations.days.find(
      (item) => item.day == new Date(date).getDay(),
    );
    if (!dateData || !dateData.is_open) {
      setTimeSlots([]);
      return;
    }
    setTimeSlots(dateData.slots);
  };

  const isValidDate = (date) => {
    if (!operations) return true;
    const dateData = operations.days.find(
      (item) => item.day == new Date(date).getDay(),
    );

    if (!dateData || !dateData.is_open) return false;
    return true;
  };

  const handleNextStep = (step) => {
    switch (step) {
      case 1:
        handleStep1();
        break;
      case 2:
        handleStep2();
        break;
      default:
        break;
    }
  };

  const triggerAddToCart = async (params) => {
    const res = await orderApi.addToCart(params);
    if (!res || res.status !== "success") {
      return false;
    }
    toast.success("Menu added to cart!");
    return true;
  };

  const handleStep2 = async () => {
    // add addons data to order -> send to add to cart.
    setIsLoading(true);

    const params = {
      delivery_date: formatDate(deliveryDate, "yyyy-MM-dd"),
      delivery_time: deliveryTime,
      dish_ids: [...selectedItems, ...selectedAddonsItems],
      num_pax: numberOfPax,
      menu_id: menuId,
    };

    updateState({ orderData: params });

    const isAdded = await triggerAddToCart(params);
    if (!isAdded) {
      toast.error("Failed to add to cart!");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    window.location.href = "/cart";
    return;
  };

  const handleStep1 = () => {
    if (!deliveryDate || !deliveryTime) {
      window.alert("Missing delivery date or delivery time");
      return;
    }

    if (selectedItems.length < COURSES_REQUIRED) {
      window.alert(`Please select ${COURSES_REQUIRED} to continue!`);
      return;
    }

    const validation = validateMenuSelection(mainDishesMenu, selectedItems);
    if (!validation.valid) {
      window.alert(validation.errors.join("\n"));
      return;
    }

    const orderData = {
      delivery_date: formatDate(deliveryDate, "yyyy-MM-dd"),
      delivery_time: deliveryTime,
      main_dishes_ids: selectedItems,
      num_pax: numberOfPax,
    };

    updateState({ orderData: orderData });
    if (addonsDishesMenu.length > 0) {
      setOrderStep(2);
      return;
    } else {
      handleStep2();
    }
  };

  const seprateMenusByType = (items) => {
    let addons = [];
    let main = [];
    items.map((item) => {
      if (item.type == "main") {
        main.push(item);
      } else {
        addons.push(item);
      }
    });

    setAddonsDishesMenu(addons);
    setMainDishesMenu(main);
  };

  if (!currentMenu)
    return (
      <>
        <h5>Loading....</h5>
      </>
    );

  return (
    <div className="order-form-container">
      <div className="order-form-layout">
        {/* Left Sidebar */}
        <div className="order-form-sidebar">
          {/* Delivery Time */}
          <div className="delivery-section">
            <div className="form-group">
              <label className="form-label">DELIVERY DATE</label>
              <div className="custom-date-picker">
                <DatePicker
                  placeholderText="Select date"
                  selected={deliveryDate}
                  disabled={orderStep == 2}
                  minDate={new Date()}
                  filterDate={isValidDate}
                  excludeDates={excludeDates}
                  onChange={handleChooseDate}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">DELIVERY TIME</label>
              <select
                className="form-select"
                value={deliveryTime}
                disabled={orderStep == 2}
                onChange={(e) => setDeliveryTime(e.target.value)}
              >
                <option value="">Select time</option>
                {timeSlots.map((time) => (
                  <option key={time.id} value={time.id}>
                    {time.start_time} - {time.end_time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Your Selection */}
          <div className="selection-section">
            <div className="selection-box">
              <h6 className="section-title">YOUR SELECTION</h6>
              <img
                src={currentMenu?.featured_img ?? ""}
                alt={currentMenu?.name ?? ""}
                className="selection-image"
              />
              <div className="selection-name">{currentMenu.name ?? ""}</div>
              <div className="selection-price">
                ${parseFloat(currentMenu?.price).toFixed(2)} / PAX
              </div>
            </div>
          </div>

          {/* Number of Pax */}
          <div className="pax-section">
            <h3 className="section-title">
              <span className="section-icon">📌</span> NUMBER OF PAX
            </h3>
            <div className="pax-info">
              (Minimum {currentMenu.min_pax ?? 0} Pax) |{" "}
              {currentMenu.dishes_qty ?? 0} courses
            </div>
            <div className="pax-controls">
              <button
                onClick={() => handlePaxChange(-1)}
                className="pax-btn pax-btn-decrease"
              >
                −
              </button>
              <input
                type="number"
                value={numberOfPax}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= currentMenu.min_pax) setNumberOfPax(val);
                }}
                className="pax-input"
              />
              <button
                onClick={() => handlePaxChange(1)}
                className="pax-btn pax-btn-increase"
              >
                +
              </button>
            </div>
            <div className="pax-selected-label">
              <span>NUMBER OF PAX SELECTED</span>
              <a href="#" className="edit-link">
                ✏️
              </a>
            </div>
            <div className="pax-selected-value">{numberOfPax}</div>
            <div className="price-label">
              <span>PRICE</span>
            </div>
            <div className="price-value">${price.toFixed(2)}</div>
            <div className="total-label">
              <span>TOTAL W/ GST</span>
            </div>
            <div className="total-value">${totalWithGST.toFixed(2)}</div>
          </div>
        </div>

        {/* Right Side - Menu Items */}
        <div className="order-form-content">
          {orderStep == 1 && (
            <DishesMenus
              data={mainDishesMenu}
              selectedItems={selectedItems}
              onSelect={handleItemToggle}
              handleNextStep={() => handleNextStep(1)}
              courses_required={COURSES_REQUIRED}
              loading={isLoading}
              type="main"
            />
          )}
          {orderStep == 2 && (
            <>
              <DishesMenus
                data={addonsDishesMenu}
                selectedItems={selectedAddonsItems}
                onSelect={handleItemToggle}
                handleNextStep={() => handleNextStep(2)}
                loading={isLoading}
                type="addons"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderForm;

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useFetchStore } from "../../hooks/useFetchStore";
import { isSlotInPast, formatSlotLabel } from "../../helpers/time-helpers";

const DeliveryInfo = () => {
  const { operations, fetchOperations, store, fetchStore } = useFetchStore();
  const minDeliveryTotal = Number(
    window.zippy_menu_order_api?.min_delivery_total ?? 40,
  );
  const initialSubtotal = Number(
    window.zippy_menu_order_api?.cart_subtotal ?? 0,
  );
  const [cartSubtotal, setCartSubtotal] = useState(initialSubtotal);
  const deliveryAllowed = cartSubtotal >= minDeliveryTotal;
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryType, setDeliveryType] = useState(
    deliveryAllowed ? "delivery" : "pickup",
  );
  const [excludeDates, setExcludeDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (!deliveryAllowed && deliveryType === "delivery") {
      setDeliveryType("pickup");
    }
  }, [deliveryAllowed]);

  useEffect(() => {
    if (!deliveryTime) return;
    const selected = timeSlots.find((s) => String(s.id) === String(deliveryTime));
    if (selected && isSlotInPast(selected, deliveryDate)) {
      setDeliveryTime("");
    }
  }, [timeSlots, deliveryDate, deliveryTime]);

  useEffect(() => {
    const readSubtotal = () => {
      const $ = window.jQuery;
      if (!$) return;
      const text = $(".cart-subtotal .amount, .order-total .amount")
        .first()
        .text();
      const parsed = parseFloat(text.replace(/[^0-9.]/g, ""));
      if (!isNaN(parsed)) setCartSubtotal(parsed);
    };
    const $body = window.jQuery ? window.jQuery(document.body) : null;
    if (!$body) return;
    $body.on("updated_checkout", readSubtotal);
    readSubtotal();
    return () => {
      $body.off("updated_checkout", readSubtotal);
    };
  }, []);
  const isValidDate = (date) => {
    if (!operations) return true;
    const dateData = operations.days.find(
      (item) => item.day == new Date(date).getDay(),
    );

    if (!dateData || !dateData.is_open) return false;
    return true;
  };

  useEffect(() => {
    handleExcludeDate();
    if (operations.days) {
      triggerHandleSlots(new Date());
    }
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

  useEffect(() => {
    fetchOperations(0);
    fetchStore(0);
  }, []);


  return (
    <div className="mb-4">
      <h3>Delivery Details {store && store.name ? '- [' + store?.name + ']' : ""}</h3>
     
      <h5></h5>
      <div className="md:flex flex-wrap gap-[6%]">
        <div className="w-[100%] flex flex-col mb-4">
          <div className="form-group">
            <label className="required_field mb-2">
              Delivery Type &nbsp; 
              <span className="required" aria-hidden="true">
                *
              </span>
            </label>
            <select
              className="h-[42px]"
              value={deliveryType}
              name="delivery_type"
              id="delivery_type"
              onChange={(e) => setDeliveryType(e.target.value)}
            >
                <option value={`delivery`} disabled={!deliveryAllowed}>
                  Home Delivery
                  {!deliveryAllowed
                    ? ` (min $${minDeliveryTotal.toFixed(0)} order)`
                    : ""}
                </option>
                <option value={`pickup`}>
                  Take Away
                </option>
            </select>
            {!deliveryAllowed && (
              <p className="text-sm text-red-600 mt-1">
                Min ${minDeliveryTotal.toFixed(2)} required for Home Delivery.
              </p>
            )}
          </div>
        </div>
        <div className="w-[47%] flex flex-col mb-4 justify-between">
          <label htmlFor="delivery_date" className="required_field mb-2">
            Delivery Date&nbsp;
            <span className="required" aria-hidden="true">
              *
            </span>
          </label>
          <DatePicker
            placeholderText="Select date"
            selected={deliveryDate}
            minDate={new Date()}
            filterDate={isValidDate}
            name="delivery_date"
            id="delivery_date"
            excludeDates={excludeDates}
            className="input-text !border-1"
            onChange={handleChooseDate}
          />
        </div>
        <div className="w-[47%] flex flex-col mb-4">
          <div className="form-group">
            <label className="required_field mb-2">
              Delivery Time &nbsp; 
              <span className="required" aria-hidden="true">
                *
              </span>
            </label>
            <select
              className="h-[42px]"
              value={deliveryTime}
              name="delivery_time"
              id="delivery_time"
              onChange={(e) => setDeliveryTime(e.target.value)}
            >
              <option value="">Select time</option>
              {timeSlots.map((time) => {
                const past = isSlotInPast(time, deliveryDate);
                return (
                  <option key={time.id} value={time.id} disabled={past}>
                    {formatSlotLabel(time)}
                    {past ? " (not available)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useFetchStore } from "../../hooks/useFetchStore";

const DeliveryInfo = () => {
  const { operations, fetchOperations, store, fetchStore } = useFetchStore();
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [excludeDates, setExcludeDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
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
                <option value={`delivery`}>
                  Home Delivery
                </option>
                <option value={`pickup`}>
                  Take Away
                </option>
            </select>
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
              {timeSlots.map((time) => (
                <option key={time.id} value={time.id}>
                  {time.start_time} - {time.end_time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;

import React, { useState, useRef, useEffect } from "react";
import Switch from "../common/Switch";

const ALL_DISHES = [
  { id: "d1", name: "Fried Rice" },
  { id: "d2", name: "Grilled Chicken" },
  { id: "d3", name: "Beef Noodles" },
  { id: "d4", name: "Spring Rolls" },
  { id: "d5", name: "Seafood Soup" },
];

const DishesBox = ({ box, updateBoxName, addDishToBox }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = ALL_DISHES.filter((dish) =>
    dish.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <input
        className="box-type"
        type="hidden"
        // value={box.max_qty ?? 0}
        // onChange={(e) =>
        //   updateBoxName(box.id, e.target.value)
        // }
      />
      <h2 className="!text-3xl !mt-0 !mb-4 font-bold !text-primary">{box.name}</h2>

      <div className="pb-6 mb-6 border-b border-gray-200 grid md:grid-cols-2 gap-4 items-center">
        {/* Box name */}
        <div className="">
          <span className="mr-4"> Name </span>
          <input
            type="text"
            value={box.name}
            onChange={(e) => updateBoxName(box.id, e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-4 items-center">
          <span> Required </span>
          <Switch />
        </div>
        {/* max_qty */}
        <div>
          <span> Max QTY </span>
          <input
            type="number"
            // value={box.max_qty ?? 0}
            // onChange={(e) =>
            //   updateBoxName(box.id, e.target.value)
            // }
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        {/* Min_qty */}
        <div>
          <span> Min QTY </span>
          <input
            type="number"
            // value={box.max_qty ?? 0}
            // onChange={(e) =>
            //   updateBoxName(box.id, e.target.value)
            // }
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Search wrapper */}
      <div ref={ref} className="relative">
        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />

        {/* Dropdown */}
        {open && search && (
          <div className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-white shadow-lg">
            {results.length > 0 ? (
              results.map((dish) => {
                const exists = box.dishes.some((d) => d.id === dish.id);

                return (
                  <div
                    key={dish.id}
                    className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    <span>{dish.name}</span>
                    <button
                      disabled={exists}
                      onClick={() => {
                        addDishToBox(box.id, dish);
                        setSearch("");
                        setOpen(false);
                      }}
                      className={`px-2 py-1 rounded cursor-pointer text-xs
                        ${
                          exists
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                    >
                      {exists ? "Added" : "Add"}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">No results</div>
            )}
          </div>
        )}
      </div>

      {/* Added dishes */}
      {box.dishes.length > 0 && (
        <div className="mt-4">
          <h4 className="!text-xl font-bold text-primary mb-2">Added dishes</h4>
          <ul className="space-y-1 text-sm">
            {box.dishes.map((dish) => (
              <li key={dish.id} className="rounded bg-gray-50 px-3 py-1">
                {dish.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DishesBox;

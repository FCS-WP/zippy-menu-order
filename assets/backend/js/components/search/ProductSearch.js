import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import InputIcon from "../common/InputIcon";
import { debounce } from "../../helpers/debounce";
import { toast } from "react-toastify";
import { ProductApi } from "../../api";

const ProductSearch = forwardRef((props, ref) => {
  const [currentService, setCurrentService] = useState(selectedService ?? null);
  const [searchQuery, setSearchQuery] = useState(data?.searchQuery ?? "");
  const [searchResults, setSearchResults] = useState(data?.searchResults ?? []);
  const [searchMessage, setSearchMessage] = useState("");

  useImperativeHandle(ref, () => ({
    getValues: () => ({
      selectedService: currentService,
      searchQuery: searchQuery,
      searchResults: searchResults,
    }),
  }));

  const handleSearch = async (keyword) => {
    // query here
    const res = await ProductApi.searchProductsByName({
      q: keyword,
    });
  
    if (res.status == "success") {
      return res.data;
    }

    return null;
  };

  const debounceSearchServices = useCallback(
    debounce(async (keyword) => {
      if (keyword.trim()) {
        const dataServices = await handleSearch(keyword);
        if (dataServices) {
          setSearchResults(dataServices.products);
          if (dataServices.products.length == 0) {
            setSearchMessage(`Not found product name "${keyword}"`);
          } else {
            setSearchMessage(``);
          }
        } else {
          toast.error("Search error");
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 500),
    [],
  );

  useEffect(() => {
    debounceSearchServices(searchQuery);
  }, [searchQuery]);

  return (
    <div>
      {/* Search Box To Select Service */}
      <InputIcon
        className="rounded-md px-4 py-2"
        iconPosition="end"
        icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Render search service results*/}
      {searchResults && searchQuery != "" && (
        <div className="search-result-box max-h-[250px] overflow-y-scroll rounded-md bg-white shadow-md">
          {searchResults.map((service) => (
            <div
              role="button"
              onClick={() => setCurrentService(service)}
              className={`search-result-item ${service.id === currentService?.id ? "bg-primary-500 text-white" : ""}`}
              key={service.id}
            >
              <div className="p-4">
                {" "}
                {service.name + " - $" + service.price}{" "}
              </div>
            </div>
          ))}

          {searchMessage && (
            <div className={`text-white}`}>
              <div className="p-4">{searchMessage}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default SelectServices;
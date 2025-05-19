import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCart from "../../components/ProductCart";
import { Outlet } from "react-router-dom";

const Products = () => {
  const [product, setProduct] = useState([]);
  const [FilterArray, setFilterArray] = useState([]);
  const [search, setSearch] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [error, setError] = useState("");

  async function fetchProducts() {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      console.log("Products from API:", response.data); // Debug log
      if (response.data && Array.isArray(response.data)) {
        const sortedProducts = response.data.sort(compareName);
        setProduct(sortedProducts);
        setFilterArray(sortedProducts);
        setError("");
      } else {
        setError("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again later.");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filteredArr = product;
    if (search !== "") {
      filteredArr = product.filter((item) => {
        return item.productname?.toLowerCase().includes(search.toLowerCase());
      });
    }
    if (min !== "") {
      filteredArr = filteredArr.filter((item) => {
        return item.price >= min;
      });
    }
    if (max !== "") {
      filteredArr = filteredArr.filter((item) => {
        return item.price <= max;
      });
    }
    setFilterArray(filteredArr);
  }, [search, min, max, product]);

  function compareName(a, b) {
    const name1 = (a.productname || "").toUpperCase();
    const name2 = (b.productname || "").toUpperCase();
    let comparison = 0;
    if (name1 > name2) {
      comparison = 1;
    } else if (name1 < name2) {
      comparison = -1;
    }
    return comparison;
  }

  return (
    <>
      <Outlet />
      <div className="flex min-h-screen mt-16 bg-[#F7F0EA]">
        {/* Filter Sidebar */}
        <div className="w-1/4 p-4 border-r border-[#AC8F6F] bg-white/50">
          <h2 className="text-xl font-medium mb-4 text-[#4D3C2A]">Filters</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[#4D3C2A] text-sm mb-1">Search</label>
              <input
                type="search"
                className="w-full p-2 border border-[#AC8F6F] rounded-md outline-none focus:ring-1 focus:ring-[#4D3C2A]"
                placeholder="Search Products"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
            
            <div>
              <label className="block text-[#4D3C2A] text-sm mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 p-2 border border-[#AC8F6F] rounded-md outline-none focus:ring-1 focus:ring-[#4D3C2A]"
                  onChange={(e) => setMin(e.target.value)}
                  value={min}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 p-2 border border-[#AC8F6F] rounded-md outline-none focus:ring-1 focus:ring-[#4D3C2A]"
                  onChange={(e) => setMax(e.target.value)}
                  value={max}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-3/4 p-4">
          <h1 className="text-2xl font-medium mb-4 text-[#4D3C2A]">Products</h1>
          
          {error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FilterArray.length === 0 ? (
                <div className="col-span-full text-center text-[#4D3C2A]">
                  No products found
                </div>
              ) : (
                FilterArray.map((item) => (
                  <ProductCart 
                    key={item.ProductId}
                    id={item.ProductId}
                    name={item.ProductName}
                    price={item.Price}
                    image={item.Images && item.Images[0] ? `http://localhost:5000/${item.Images[0]}` : '/default-product-image.jpg'}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;

import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCart from "../../components/ProductCart";
import { Outlet } from "react-router-dom";

const Products = () => {
  const [product, setProduct] = useState([]);
  const [FilterArray, setFilterArray] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("");
  const [error, setError] = useState("");

  // Get category from URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    // Set the type filter based on URL parameter
    if (categoryParam) {
      // Capitalize first letter to match the format in the database
      const formattedCategory = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
      setSelectedType(formattedCategory);
    }
  }, [categoryParam]);

  const compareName = (a, b) => {
    return a.ProductName.localeCompare(b.ProductName);
  };

  async function fetchProducts() {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      console.log("Products from API:", response.data);
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
    
    // Price filter
    if (minPrice !== "") {
      filteredArr = filteredArr.filter((item) => {
        const itemPrice = parseFloat(item.Price);
        return !isNaN(itemPrice) && itemPrice >= parseFloat(minPrice);
      });
    }
    if (maxPrice !== "") {
      filteredArr = filteredArr.filter((item) => {
        const itemPrice = parseFloat(item.Price);
        return !isNaN(itemPrice) && itemPrice <= parseFloat(maxPrice);
      });
    }

    // Type filter
    if (selectedType) {
      filteredArr = filteredArr.filter((item) => {
        return item.Type === selectedType && item.Type !== 'Custom';
      });
    }

    // Metal filter
    if (selectedMetal) {
      filteredArr = filteredArr.filter((item) => {
        return item.Metal === selectedMetal;
      });
    }

    setFilterArray(filteredArr);
  }, [minPrice, maxPrice, selectedType, selectedMetal, product]);

  // Get unique types and metals for filter options
  const types = [...new Set(product.filter(item => item.Type !== 'Custom').map(item => item.Type))];
  const metals = [...new Set(product.map(item => item.Metal))];

  return (
    <>
      <Outlet />
      <div className="flex min-h-screen mt-16 bg-[#F7F0EA]">
        {/* Filter Sidebar */}
        <div className="w-1/4 p-4 border-r border-[#AC8F6F] bg-white/50">
          <h2 className="text-xl font-medium mb-4 text-[#4D3C2A]">Filters</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[#4D3C2A] text-sm mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 p-2 border border-[#AC8F6F] rounded-md outline-none focus:ring-1 focus:ring-[#4D3C2A]"
                  onChange={(e) => setMinPrice(e.target.value)}
                  value={minPrice}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 p-2 border border-[#AC8F6F] rounded-md outline-none focus:ring-1 focus:ring-[#4D3C2A]"
                  onChange={(e) => setMaxPrice(e.target.value)}
                  value={maxPrice}
                />
              </div>
            </div>

            <div>
              <label className="block text-[#4D3C2A] text-sm mb-1">Type</label>
              <select
                className="w-full p-2 border border-[#AC8F6F] rounded-md outline-none focus:ring-1 focus:ring-[#4D3C2A]"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#4D3C2A] text-sm mb-1">Metal</label>
              <select
                className="w-full p-2 border border-[#AC8F6F] rounded-md outline-none focus:ring-1 focus:ring-[#4D3C2A]"
                value={selectedMetal}
                onChange={(e) => setSelectedMetal(e.target.value)}
              >
                <option value="">All Metals</option>
                {metals.map((metal) => (
                  <option key={metal} value={metal}>{metal}</option>
                ))}
              </select>
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

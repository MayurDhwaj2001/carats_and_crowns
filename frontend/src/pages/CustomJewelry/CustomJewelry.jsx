import React, { useEffect, useState } from "react";
import ProductCart from "../../components/ProductCart";
import axios from "axios";

const CustomJewelry = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomProducts();
  }, []);

  async function fetchCustomProducts() {
    try {
      const response = await axios.get("http://localhost:5000/api/products/custom");
      if (response.data && Array.isArray(response.data)) {
        // Add backend URL prefix to image paths
        const productsWithImages = response.data.map(product => ({
          ...product,
          Images: product.Images?.map(image => `http://localhost:5000/${image}`)
        }));
        setProducts(productsWithImages);
        setError("");
      } else {
        setError("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Error fetching custom products:", error);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F0EA] pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#4D3C2A] mb-8">Custom Jewelry</h1>
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCart
                key={product.ProductId}
                id={product.ProductId}
                image={product.Images[0]}
                name={product.ProductName}
                price={product.Price}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomJewelry;
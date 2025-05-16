import { useNavigate } from "react-router-dom";

const ProductCart = ({ image, name, price, id }) => {
  const navigate = useNavigate();
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-3 bg-white">
        <h3 className="font-medium text-[#4D3C2A] truncate">{name}</h3>
        <p className="text-[#AC8F6F] font-medium mt-1">₹{price}</p>
      </div>
    </div>
  );
};

export default ProductCart;

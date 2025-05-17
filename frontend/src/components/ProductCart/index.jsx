import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useContext } from "react";
import { Add } from "../../store/redux/cart/CartAction";
import authContext from "../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const ProductCart = ({ image, name, price, id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useContext(authContext);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      if (token) {
        dispatch(Add({
          id,
          title: name,
          price,
          image,
          quantity: newQuantity,
          total: price * newQuantity
        }));
      }
    }
  };

  const handleClick = (e, action) => {
    e.stopPropagation(); // Prevent navigation when clicking quantity controls
    if (action === 'inc') {
      handleQuantityChange(quantity + 1);
    } else if (action === 'dec' && quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div 
        className="cursor-pointer"
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

      {token && (
        <div className="p-3 pt-0 flex items-center justify-between border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon
              icon={faSquareMinus}
              className="text-xl text-[#AC8F6F] cursor-pointer hover:text-[#4D3C2A] transition-colors"
              onClick={(e) => handleClick(e, 'dec')}
            />
            <span className="text-[#4D3C2A] font-medium">{quantity}</span>
            <FontAwesomeIcon
              icon={faSquarePlus}
              className="text-xl text-[#AC8F6F] cursor-pointer hover:text-[#4D3C2A] transition-colors"
              onClick={(e) => handleClick(e, 'inc')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCart;

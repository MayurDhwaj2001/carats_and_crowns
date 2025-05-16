import BuySteps from "../../components/BuyStepsCard/BuySteps.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Carousel from "../../components/Carousel/Carousel.jsx";
import ShopByCategory from "../../components/ShopByCategory/ShopByCategory.jsx";

const HOME = () => {
  return (
    <>
      <div className="scroll-smooth focus:scroll-auto pt-16"> 
        <Carousel />
        <ShopByCategory />
        <BuySteps />
        <Footer />
      </div>
    </>
  );
};

export default HOME;

import BuySteps from "../../components/BuyStepsCard/BuySteps.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Carousel from "../../components/Carousel/Carousel.jsx";
import ShopByCategory from "../../components/ShopByCategory/ShopByCategory.jsx";
import OurPromise from '../../components/OurPromise/OurPromise';
import CustomerReviews from '../../components/CustomerReviews/CustomerReviews';
import VisitOurStores from '../../components/VisitOurStores/VisitOurStores';
import FAQ from '../../components/FAQ/FAQ';

const HOME = () => {
  return (
    <>
      <div className="scroll-smooth focus:scroll-auto pt-16"> 
        <Carousel />
        <ShopByCategory />
        <BuySteps />
        <OurPromise />
        <CustomerReviews />
        <VisitOurStores />
        <FAQ />
        <Footer />
      </div>
    </>
  );
};

export default HOME;

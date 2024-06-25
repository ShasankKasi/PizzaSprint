import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TotalCartQuantity, getTotalCartPrice } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";

function CartOverview() {
  const totalquantity=useSelector(TotalCartQuantity);
  const totalPrice=useSelector(getTotalCartPrice);
  return (
    <div className="bg-stone-950 text-stone-200 uppercase p-4 px-4 sm:px-6 flex items-center justify-between">
      <p className="font-semibold text-stone-300 space-x-4 md:text-base sm:space-x-6 text-sm">
        <span>{totalquantity} pizzas</span>
        <span>  {formatCurrency(totalPrice)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;

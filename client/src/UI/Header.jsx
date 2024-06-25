import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";
 
export default function Header() {
  return (
    <header className="bg-yellow-400 uppercase sm:px-6 px-4 py-4 border-b border-stone-200 flex items-center justify-between">
       <Link to="/" className="tracking-widest">Pizza Sprint Co. 🚴</Link>
       <SearchOrder/>
       <Username/>
    </header>
  )
}

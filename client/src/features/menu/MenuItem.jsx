import { useDispatch, useSelector } from "react-redux";
import Button from "../../UI/Button";
import { formatCurrency } from "../../utils/helpers";
import { addItem, getCurrentQuantityById } from "../cart/cartSlice";
import DeleteItem from "../cart/DeleteItem";
import UpdateItemQuantity from "../cart/UpdateItemQuantity";

/* eslint-disable react/prop-types */
function MenuItem({ pizza }) {
  const dispatch = useDispatch();
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const currentQuantity=useSelector(getCurrentQuantityById(id));
  const inCart=currentQuantity>0;
  function handleAddTOCart() {
    const newItem = {
      pizzaId: id,
      name,
      quantity:1,
      unitPrice,
      totalPrice:unitPrice*1,
    };

    dispatch(addItem(newItem));
  }
  return (
    <li className="flex gap-4 py-2">
      <img
        src={imageUrl}
        alt={name}
        className={`h-24 ${soldOut ? "opacity-70 grayscale" : ""}`}
      />
      <div className="flex grow flex-col pt-0.5">
        <p className="font-medium">{name}</p>
        <p className="text-sm capitalize italic">{ingredients.join(", ")}</p>

        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm font-medium uppercase text-stone-500">
              Sold out
            </p>
          )}
          { inCart && <div className="flex items-center gap-3 sm:gap-8">

          <UpdateItemQuantity pizzaId={id} currentQuantity={currentQuantity}/>
          <DeleteItem id={id}/>
          </div>
          }
          {!soldOut && !inCart &&  (
            <Button type="small" onClick={handleAddTOCart}>
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;

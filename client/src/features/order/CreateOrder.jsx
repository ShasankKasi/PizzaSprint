// import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../UI/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {
    username,
    status: addressStatus,
    position,
    address,
    error:errorAddress,
  } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const isLoadingAddress = addressStatus === "loading";
  const isSubmitting = navigation.state === "submitting";
  const cart = useSelector(getCart);

  const formErrors = useActionData();
  const TotalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? TotalCartPrice * 0.2 : 0;
  const totalPrice = TotalCartPrice + priorityPrice;
  const dispatch = useDispatch();
  if (!cart.length) return <EmptyCart />;
  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Lets go!</h2>
      <Form method="Post">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            required
            className="input grow"
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full" />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-200 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              defaultValue={address}
              disabled={isLoadingAddress}
              className="input w-full"
            />
            {addressStatus==='error' && (
              <p className="mt-2 rounded-md bg-red-200 p-2 text-xs text-red-700">
                {errorAddress} . You can add your address manually too .
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute right-[5px] z-50 top-[5px] md:right-[5px] md:top-[3px]">
              <Button
                disabled={isLoadingAddress || isSubmitting}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get Position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to give your order priority ? Pay 20 % extra
          </label>
        </div>

        <div>
          <input type="hidden" name="position" value={position.latitude&& position.longitude?`${position.latitude},${position.longitude}`:''}/>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button disabled={isSubmitting} type="primary">
            {isSubmitting
              ? "Placing Your Order..."
              : `Order now - Pay ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
          <div className="px-2 py-16 font-semibold text-black-400 text-xl"> 👉 Currently only Cash 💸 on deliveries are accepted 👈</div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  // console.log(request)
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };
  //  console.log(order);
  const newOrder = await createOrder(order);
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Error in Mobile Number entered.We might need it to contact you";
  if (Object.keys(errors).length > 0) return errors;
  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;

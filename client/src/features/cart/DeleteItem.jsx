/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import Button from "../../UI/Button";
import { deleteItem } from "./cartSlice";

export default function DeleteItem({id}) {
    const dispatch=useDispatch();
  return (
    <Button type="small" onClick={()=>dispatch(deleteItem(id))}>Delete</Button>

  )
}

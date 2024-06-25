import { useFetcher } from "react-router-dom";
import Button from "../../UI/Button";
import { updateOrder } from "../../services/apiRestaurant";

// eslint-disable-next-line react/prop-types, no-unused-vars
export default function UpdateOrder({order}) {
    const fetcher=useFetcher();

  return (
    <fetcher.Form method='PATCH' className="text-right">
    <Button type="primary">
      Make Priority 
    </Button>
    </fetcher.Form>
  )
}
// eslint-disable-next-line no-unused-vars
export async function action({request,params})
{   const data={priority:true};
    await updateOrder(params.orderID,data);
    return null;
}
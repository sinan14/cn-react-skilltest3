import { OrderItem } from "../../types/OrderItem";
type PropType = {
  orderItem: OrderItem;
};

export default function OrderProductItem({ orderItem }: PropType) {
  return (
    <div className="w-full px-3 min-[400px]:px-6">
      <div className="flex flex-col lg:flex-row items-center py-6 border-b border-gray-200 gap-6 w-full">
        <div className="img-box max-lg:w-full">
          <img
            src={orderItem.image}
            alt="Premium Watch image"
            className="aspect-square w-full lg:max-w-[140px] rounded-xl"
          />
        </div>
        <div className="flex flex-row items-center w-full ">
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
            <div className="flex items-center">
              <div className="">
                <h2 className="font-semibold text-xl leading-8 text-black mb-3">
                  {orderItem.title}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-5">
              <div className="col-span-5 lg:col-span-1 flex items-center max-lg:mt-3">
                <div className="flex gap-3 lg:block">
                  <p className="font-medium text-sm leading-7 text-black">
                    price
                  </p>
                  <p className="lg:mt-4 font-medium text-sm leading-7 text-indigo-600">
                    ₹{orderItem.price}
                  </p>
                </div>
              </div>
              <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3 ">
                <div className="flex gap-3 lg:block">
                  <p className="font-medium text-sm leading-7 text-black">
                    Quantity
                  </p>
                  <p className="lg:mt-4 font-medium text-sm leading-7 text-indigo-600 text-center">
                    {orderItem.quantity}
                  </p>
                </div>
              </div>
              <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3">
                <div className="flex gap-3 lg:block">
                  <p className="font-medium text-sm whitespace-nowrap leading-6 text-black">
                    Total Price
                  </p>
                  <p className="lg:mt-4 font-medium text-sm leading-7 text-indigo-600 text-center">
                    ₹{(orderItem.price*orderItem.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

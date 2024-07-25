import { Order } from "../../types/Order";
import OrderProductItem from "./OrderProductItem";

type PropType = {
  order: Order;
};
export default function OrderItem({ order }: PropType) {
  return (
    <div className="main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
        <div className="data">
          <p className="font-semibold text-base leading-7 text-black">
            Order Id:{" "}
            <span className="text-indigo-600 font-medium">#{order.orderId}</span>
          </p>
          <p className="font-semibold text-base leading-7 text-black mt-4">
            Order Date :{" "}
            <span className="text-gray-400 font-medium">
              {" "}
              {order.date.toLocaleDateString("en-GB")}
            </span>
          </p>
        </div>
      </div>
      {order.items.map((orderItem, index) => (
        <OrderProductItem key={index} orderItem={orderItem} />
      ))}

      <div className="w-full border-t border-gray-200 px-6 flex flex-col lg:flex-row items-center justify-between ">
        <div className="flex flex-col sm:flex-row items-center max-lg:border-b border-gray-200"></div>
        <p className="font-semibold text-lg text-black py-6">
          Total Price:{" "}
          <span className="text-indigo-600"> ₹{order.total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}

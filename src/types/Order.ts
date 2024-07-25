import { OrderItem } from "./OrderItem";

export interface Order {
  total: number;
  date: Date;
  items: OrderItem[];
  orderId: string;
  uid:string;
}

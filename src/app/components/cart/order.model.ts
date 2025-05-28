export interface orderItem {
  productId: string;
  name: string;
  quantity: number;
  priceAtPurchase: number;
}
export interface orderModel {
  _id: string;
  buyerId: string;
  products: orderItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: 'credit_card' | 'cash';
  isPaid: boolean;
  status:"Order placed" | "Order sent" | "Order delivered";
  orderId?: string;
  createdAt?: Date;
}

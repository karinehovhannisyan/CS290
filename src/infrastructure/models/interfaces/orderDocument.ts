export interface OrderDocument extends Document {
  date: Date;
  user;
  address;
  orderItems;
}
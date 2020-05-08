export interface UserDocument extends Document {
  name: string;
  surname: string;
  password: string;
  email: string;
  token: string;
  dob: Date;
  phone: string;
  balance: number;
}
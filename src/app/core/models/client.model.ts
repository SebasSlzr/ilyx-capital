export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  businessType?: string;
  totalTransactions: number;
  createdAt: Date;
}

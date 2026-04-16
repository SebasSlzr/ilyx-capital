export interface Movement {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  projectId?: string;
  clientId?: string;
}
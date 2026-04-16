export interface Project {
  id: string;
  name: string;
  description?: string;
  totalIncome: number;
  totalExpense: number;
  status: 'active' | 'paused' | 'closed';
  createdAt: Date;
}
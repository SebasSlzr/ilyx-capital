import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../../core/services/finance.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe],
  templateUrl: './balance.html',
  styleUrl: './balance.scss',
})
export class BalanceComponent implements OnInit {
  totalIncome = 0;
  totalExpense = 0;
  get netBalance() { return this.totalIncome - this.totalExpense; }

  categoryTotals: { category: string; income: number; expense: number }[] = [];

  constructor(private financeService: FinanceService) {}

  ngOnInit() {
    const movements = this.financeService.getAll();
    this.totalIncome  = movements.filter(m => m.type === 'income').reduce((s, m) => s + m.amount, 0);
    this.totalExpense = movements.filter(m => m.type === 'expense').reduce((s, m) => s + m.amount, 0);

    const cats = this.financeService.categories;
    this.categoryTotals = cats.map(cat => ({
      category: cat,
      income:  movements.filter(m => m.category === cat && m.type === 'income').reduce((s, m) => s + m.amount, 0),
      expense: movements.filter(m => m.category === cat && m.type === 'expense').reduce((s, m) => s + m.amount, 0),
    })).filter(c => c.income > 0 || c.expense > 0);
  }
}
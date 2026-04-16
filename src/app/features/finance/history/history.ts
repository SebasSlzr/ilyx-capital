import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../../core/services/finance.service';
import { Movement } from '../../../core/models/movement.model';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class HistoryComponent implements OnInit {
  all: Movement[] = [];
  filtered: Movement[] = [];
  search = '';
  typeFilter: 'all' | 'income' | 'expense' = 'all';
  categoryFilter = '';

  constructor(private financeService: FinanceService) {}

  ngOnInit() {
    this.financeService.movements$.subscribe(data => {
      this.all = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.applyFilters();
    });
  }

  get categories() { return this.financeService.categories; }

  get totalIncome() { return this.filtered.filter(m => m.type === 'income').reduce((s, m) => s + m.amount, 0); }
  get totalExpense() { return this.filtered.filter(m => m.type === 'expense').reduce((s, m) => s + m.amount, 0); }

  applyFilters() {
    this.filtered = this.all.filter(m => {
      const matchSearch = m.description.toLowerCase().includes(this.search.toLowerCase());
      const matchType = this.typeFilter === 'all' || m.type === this.typeFilter;
      const matchCat = !this.categoryFilter || m.category === this.categoryFilter;
      return matchSearch && matchType && matchCat;
    });
  }

  showToast = false;
  export() { this.showToast = true; setTimeout(() => this.showToast = false, 3000); }
}
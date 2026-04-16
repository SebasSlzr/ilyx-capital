import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../../core/services/finance.service';
import { Movement } from '../../../core/models/movement.model';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe],
  templateUrl: './movements.html',
  styleUrl: './movements.scss',
})
export class MovementsComponent implements OnInit {
  movements: Movement[] = [];
  filtered: Movement[] = [];
  activeFilter: 'all' | 'income' | 'expense' = 'all';
  showModal = signal(false);
  isEditing = false;
  deleteConfirmId: string | null = null;

  form: Partial<Movement> & { dateStr: string } = {
    type: 'income', amount: 0, category: '', description: '', dateStr: '', projectId: '', clientId: ''
  };

  constructor(private financeService: FinanceService) {}

  ngOnInit() {
    this.financeService.movements$.subscribe(data => {
      this.movements = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.applyFilter();
    });
  }

  get categories() { return this.financeService.categories; }

  applyFilter() {
    this.filtered = this.activeFilter === 'all'
      ? this.movements
      : this.movements.filter(m => m.type === this.activeFilter);
  }

  setFilter(f: 'all' | 'income' | 'expense') {
    this.activeFilter = f;
    this.applyFilter();
  }

  openNew() {
    this.isEditing = false;
    this.form = { type: 'income', amount: 0, category: this.categories[0], description: '', dateStr: new Date().toISOString().split('T')[0] };
    this.showModal.set(true);
  }

  openEdit(m: Movement) {
    this.isEditing = true;
    this.form = { ...m, dateStr: new Date(m.date).toISOString().split('T')[0] };
    this.showModal.set(true);
  }

  save() {
    if (!this.form.amount || !this.form.description || !this.form.category) return;
    const movement = { ...this.form, date: new Date(this.form.dateStr) } as Movement;
    if (this.isEditing && this.form.id) {
      this.financeService.update(this.form.id, movement);
    } else {
      const { id, dateStr, ...rest } = this.form as any;
      this.financeService.add({ ...rest, date: new Date(this.form.dateStr) });
    }
    this.showModal.set(false);
  }

  confirmDelete(id: string) { this.deleteConfirmId = id; }

  doDelete() {
    if (this.deleteConfirmId) {
      this.financeService.delete(this.deleteConfirmId);
      this.deleteConfirmId = null;
    }
  }

  closeModal() { this.showModal.set(false); }
}
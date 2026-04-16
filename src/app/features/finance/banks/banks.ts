import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

interface BankAccount { id: string; name: string; bankName: string; balance: number; lastMovements: string[]; }

@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe],
  templateUrl: './banks.html',
  styleUrl: './banks.scss',
})
export class BanksComponent {
  accounts: BankAccount[] = [
    { id: '1', name: 'Cuenta Principal', bankName: 'Bancolombia', balance: 8500000, lastMovements: ['Venta productos +$1.500.000', 'Pago servicios -$350.000', 'Consultoría +$800.000'] },
    { id: '2', name: 'Caja Menor',       bankName: 'Efectivo',    balance: 450000,  lastMovements: ['Compra papelería -$120.000', 'Viáticos -$80.000', 'Varios -$50.000'] },
    { id: '3', name: 'Ahorros',          bankName: 'Davivienda',  balance: 3500000, lastMovements: ['Depósito +$500.000', 'Depósito +$1.000.000', 'Intereses +$12.000'] },
  ];

  showModal = signal(false);
  newAccount = { name: '', bankName: '', balance: 0 };

  constructor(private router: Router) {}

  get totalBalance() { return this.accounts.reduce((s, a) => s + a.balance, 0); }

  goToDetail(id: string) { this.router.navigate(['/finance/banks', id]); }

  save() {
    if (!this.newAccount.name) return;
    this.accounts.push({ id: Date.now().toString(), name: this.newAccount.name, bankName: this.newAccount.bankName, balance: this.newAccount.balance, lastMovements: [] });
    this.newAccount = { name: '', bankName: '', balance: 0 };
    this.showModal.set(false);
  }
}
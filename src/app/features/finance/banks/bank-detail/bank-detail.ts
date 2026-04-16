import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

interface BankMovement {
  description: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense';
}

interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  balance: number;
  movements: BankMovement[];
}

const ACCOUNTS_DETAIL: BankAccount[] = [
  {
    id: '1', name: 'Cuenta Principal', bankName: 'Bancolombia', balance: 8500000,
    movements: [
      { description: 'Venta productos',      date: new Date('2025-03-15'), amount: 1500000, type: 'income'  },
      { description: 'Pago servicios',        date: new Date('2025-03-18'), amount: 350000,  type: 'expense' },
      { description: 'Consultoría cliente',   date: new Date('2025-03-20'), amount: 800000,  type: 'income'  },
      { description: 'Compra suministros',    date: new Date('2025-03-22'), amount: 120000,  type: 'expense' },
      { description: 'Pedido mayorista',      date: new Date('2025-03-25'), amount: 2900000, type: 'income'  },
      { description: 'Nómina colaborador',    date: new Date('2025-03-28'), amount: 900000,  type: 'expense' },
    ]
  },
  {
    id: '2', name: 'Caja Menor', bankName: 'Efectivo', balance: 450000,
    movements: [
      { description: 'Compra papelería',   date: new Date('2025-03-10'), amount: 120000, type: 'expense' },
      { description: 'Viáticos transporte',date: new Date('2025-03-14'), amount: 80000,  type: 'expense' },
      { description: 'Reembolso cliente',  date: new Date('2025-03-16'), amount: 50000,  type: 'income'  },
      { description: 'Varios menores',     date: new Date('2025-03-20'), amount: 50000,  type: 'expense' },
    ]
  },
  {
    id: '3', name: 'Ahorros', bankName: 'Davivienda', balance: 3500000,
    movements: [
      { description: 'Depósito programado', date: new Date('2025-02-01'), amount: 500000,  type: 'income' },
      { description: 'Depósito mensual',    date: new Date('2025-03-01'), amount: 1000000, type: 'income' },
      { description: 'Intereses mes',       date: new Date('2025-03-31'), amount: 12000,   type: 'income' },
    ]
  },
];

@Component({
  selector: 'app-bank-detail',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
  templateUrl: './bank-detail.html',
  styleUrl: './bank-detail.scss',
})
export class BankDetailComponent implements OnInit {
  account: BankAccount | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.account = ACCOUNTS_DETAIL.find(a => a.id === id);
    if (!this.account) this.router.navigate(['/finance/banks']);
  }

  get totalIncome()  { return this.account?.movements.filter(m => m.type === 'income').reduce((s, m) => s + m.amount, 0) ?? 0; }
  get totalExpense() { return this.account?.movements.filter(m => m.type === 'expense').reduce((s, m) => s + m.amount, 0) ?? 0; }

  goBack() { this.router.navigate(['/finance/banks']); }
}
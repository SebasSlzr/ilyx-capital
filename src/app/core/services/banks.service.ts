import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const KEY_ACCOUNTS  = 'ilyx_banks';
const KEY_MOVEMENTS = 'ilyx_bank_movements';

export interface BankMovement {
  id: string;
  accountId: string;
  description: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense';
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  balance: number;
}

const MOCK_ACCOUNTS: BankAccount[] = [
  { id: '1', name: 'Cuenta Principal', bankName: 'Bancolombia', balance: 8500000 },
  { id: '2', name: 'Caja Menor',       bankName: 'Efectivo',    balance: 450000  },
  { id: '3', name: 'Ahorros',          bankName: 'Davivienda',  balance: 3500000 },
];

const MOCK_MOVEMENTS: BankMovement[] = [
  { id: '1',  accountId: '1', description: 'Venta productos',       date: new Date('2025-03-15'), amount: 1500000, type: 'income'  },
  { id: '2',  accountId: '1', description: 'Pago servicios',         date: new Date('2025-03-18'), amount: 350000,  type: 'expense' },
  { id: '3',  accountId: '1', description: 'Consultoría cliente',    date: new Date('2025-03-20'), amount: 800000,  type: 'income'  },
  { id: '4',  accountId: '1', description: 'Compra suministros',     date: new Date('2025-03-22'), amount: 120000,  type: 'expense' },
  { id: '5',  accountId: '1', description: 'Pedido mayorista',       date: new Date('2025-03-25'), amount: 2900000, type: 'income'  },
  { id: '6',  accountId: '1', description: 'Nómina colaborador',     date: new Date('2025-03-28'), amount: 900000,  type: 'expense' },
  { id: '7',  accountId: '2', description: 'Compra papelería',       date: new Date('2025-03-10'), amount: 120000,  type: 'expense' },
  { id: '8',  accountId: '2', description: 'Viáticos transporte',    date: new Date('2025-03-14'), amount: 80000,   type: 'expense' },
  { id: '9',  accountId: '2', description: 'Reembolso cliente',      date: new Date('2025-03-16'), amount: 50000,   type: 'income'  },
  { id: '10', accountId: '2', description: 'Varios menores',         date: new Date('2025-03-20'), amount: 50000,   type: 'expense' },
  { id: '11', accountId: '3', description: 'Depósito programado',    date: new Date('2025-02-01'), amount: 500000,  type: 'income'  },
  { id: '12', accountId: '3', description: 'Depósito mensual',       date: new Date('2025-03-01'), amount: 1000000, type: 'income'  },
  { id: '13', accountId: '3', description: 'Intereses mes',          date: new Date('2025-03-31'), amount: 12000,   type: 'income'  },
];

@Injectable({ providedIn: 'root' })
export class BanksService {
  private accountsSubject: BehaviorSubject<BankAccount[]>;
  private movementsSubject: BehaviorSubject<BankMovement[]>;

  constructor() {
    const savedA = localStorage.getItem(KEY_ACCOUNTS);
    const initialA: BankAccount[] = savedA ? JSON.parse(savedA) : MOCK_ACCOUNTS;
    this.accountsSubject = new BehaviorSubject<BankAccount[]>(initialA);
    this.accountsSubject.subscribe(data => localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(data)));

    const savedM = localStorage.getItem(KEY_MOVEMENTS);
    const initialM: BankMovement[] = savedM
      ? JSON.parse(savedM).map((m: any) => ({ ...m, date: new Date(m.date) }))
      : MOCK_MOVEMENTS;
    this.movementsSubject = new BehaviorSubject<BankMovement[]>(initialM);
    this.movementsSubject.subscribe(data => localStorage.setItem(KEY_MOVEMENTS, JSON.stringify(data)));
  }

  get accounts$() { return this.accountsSubject.asObservable(); }
  getAccounts(): BankAccount[] { return this.accountsSubject.getValue(); }
  getById(id: string): BankAccount | undefined { return this.accountsSubject.getValue().find(a => a.id === id); }
  getTotalBalance(): number { return this.accountsSubject.getValue().reduce((s, a) => s + a.balance, 0); }

  addAccount(account: Omit<BankAccount, 'id'>): void {
    this.accountsSubject.next([...this.accountsSubject.getValue(), { ...account, id: Date.now().toString() }]);
  }

  getMovementsByAccount(accountId: string): BankMovement[] {
    return this.movementsSubject.getValue()
      .filter(m => m.accountId === accountId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getRecentByAccount(accountId: string, limit = 3): BankMovement[] {
    return this.getMovementsByAccount(accountId).slice(0, limit);
  }
}
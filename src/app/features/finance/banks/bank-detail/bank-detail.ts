import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BanksService, BankAccount, BankMovement } from '../../../../core/services/banks.service';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-bank-detail',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
  templateUrl: './bank-detail.html',
  styleUrl: './bank-detail.scss',
})
export class BankDetailComponent implements OnInit {
  account: BankAccount | undefined;
  movements: BankMovement[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private banksService: BanksService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.account = this.banksService.getById(id);
    if (!this.account) { this.router.navigate(['/finance/banks']); return; }
    this.movements = this.banksService.getMovementsByAccount(id);
  }

  get incomeMovements()  { return this.movements.filter(m => m.type === 'income');  }
  get expenseMovements() { return this.movements.filter(m => m.type === 'expense'); }
  get totalIncome()  { return this.incomeMovements.reduce((s, m) => s + m.amount, 0);  }
  get totalExpense() { return this.expenseMovements.reduce((s, m) => s + m.amount, 0); }

  goBack() { this.router.navigate(['/finance/banks']); }
}
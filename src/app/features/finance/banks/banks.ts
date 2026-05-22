import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BanksService, BankAccount } from '../../../core/services/banks.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe],
  templateUrl: './banks.html',
  styleUrl: './banks.scss',
})
export class BanksComponent implements OnInit {
  accounts: BankAccount[] = [];
  totalBalance = 0;
  showModal = signal(false);
  newAccount = { name: '', bankName: '', balance: 0 };

  constructor(private banksService: BanksService, private router: Router) {}

  ngOnInit() {
    this.banksService.accounts$.subscribe(accounts => {
      this.accounts = accounts;
      this.totalBalance = this.banksService.getTotalBalance();
    });
  }

  getRecent(id: string) {
    return this.banksService.getRecentByAccount(id);
  }

  goToDetail(id: string) { this.router.navigate(['/finance/banks', id]); }

  save() {
    if (!this.newAccount.name) return;
    this.banksService.addAccount({ ...this.newAccount });
    this.newAccount = { name: '', bankName: '', balance: 0 };
    this.showModal.set(false);
  }
}
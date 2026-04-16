import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip
} from 'chart.js';
import { FinanceService } from '../../core/services/finance.service';
import { AuthService } from '../../core/services/auth.service';
import { Movement } from '../../core/models/movement.model';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

type Period = 'mes' | 'semana' | 'dia';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  userName = '';
  businessName = '';
  today = new Date();
  activePeriod: Period = 'mes';

  totalCapital = 12450000;
  totalIncome = 0;
  totalExpense = 0;
  get netBalance() { return this.totalIncome - this.totalExpense; }

  recentMovements: Movement[] = [];

  // Datos por período
  private dataMap: Record<Period, { incomePoints: number[]; expensePoints: number[]; labels: string[] }> = {
    mes: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      incomePoints:  [1500000, 2200000, 3200000, 1800000, 2900000, 3500000],
      expensePoints: [350000,  930000,  1330000, 740000,  525000,  800000],
    },
    semana: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      incomePoints:  [400000, 750000, 200000, 900000, 1100000, 600000, 300000],
      expensePoints: [120000, 80000,  200000, 150000, 300000,  90000,  60000],
    },
    dia: {
      labels: ['6am', '9am', '12pm', '3pm', '6pm', '9pm'],
      incomePoints:  [0, 150000, 400000, 250000, 700000, 100000],
      expensePoints: [0, 50000,  120000, 80000,  200000, 30000],
    }
  };

  incomeChartData!: ChartConfiguration<'line'>['data'];
  expenseChartData!: ChartConfiguration<'line'>['data'];

  incomeChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: {
      label: ctx => `$${(ctx.raw as number).toLocaleString('es-CO')}`
    }}},
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9B92C4', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9B92C4', font: { size: 11 },
           callback: v => '$' + Number(v).toLocaleString('es-CO') } }
    }
  };

  expenseChartOptions: ChartConfiguration<'line'>['options'] = {
    ...this.incomeChartOptions,
  };

  constructor(
    private financeService: FinanceService,
    private authService: AuthService,
    private router: Router
  ) {}

  
  ngOnInit() {
    
    const user = this.authService.getUser();
    this.userName = user.name.split(' ')[0];
    this.businessName = user.businessName;
    this.totalIncome  = this.financeService.getTotalByType('income');
    this.totalExpense = this.financeService.getTotalByType('expense');
    this.recentMovements = this.financeService.getRecent(6);
    this.buildCharts('mes');
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  setPeriod(p: Period) {
    this.activePeriod = p;
    this.buildCharts(p);
  }

  buildCharts(p: Period) {
    const d = this.dataMap[p];

    this.incomeChartData = {
      labels: d.labels,
      datasets: [{
        data: d.incomePoints,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16,185,129,0.15)',
        pointBackgroundColor: '#10B981',
        pointRadius: 4,
        tension: 0.4,
        fill: true,
      }]
    };

    this.expenseChartData = {
      labels: d.labels,
      datasets: [{
        data: d.expensePoints,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239,68,68,0.12)',
        pointBackgroundColor: '#EF4444',
        pointRadius: 4,
        tension: 0.4,
        fill: true,
      }]
    };
  }

  goToHistory()   { this.router.navigate(['/finance/history']); }
  goToMovements() { this.router.navigate(['/finance/movements']); }
}
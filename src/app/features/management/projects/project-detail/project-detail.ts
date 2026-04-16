import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../../../../core/services/projects.service';
import { Project } from '../../../../core/models/project.model';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

interface ProjectEntry {
  id: string;
  image: string;
  productName: string;
  category: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense';
  description: string;
}

const MOCK_ENTRIES: Record<string, ProjectEntry[]> = {
  '1': [
    { id: '1', image: '', productName: 'Camiseta estampada',   category: 'Ventas',            date: new Date('2024-10-15'), amount: 450000,  type: 'income',  description: 'Venta 10 unidades' },
    { id: '2', image: '', productName: 'Bolsa ecológica',      category: 'Ventas',            date: new Date('2024-10-22'), amount: 180000,  type: 'income',  description: 'Venta 10 unidades' },
    { id: '3', image: '', productName: 'Envío y logística',    category: 'Gastos Operativos', date: new Date('2024-10-25'), amount: 120000,  type: 'expense', description: 'Costo envíos mes' },
    { id: '4', image: '', productName: 'Agenda personalizada', category: 'Ventas',            date: new Date('2024-11-05'), amount: 650000,  type: 'income',  description: 'Venta 10 unidades' },
    { id: '5', image: '', productName: 'Publicidad digital',   category: 'Gastos Operativos', date: new Date('2024-11-10'), amount: 200000,  type: 'expense', description: 'Pauta redes sociales' },
    { id: '6', image: '', productName: 'Taza cerámica',        category: 'Ventas',            date: new Date('2024-12-01'), amount: 960000,  type: 'income',  description: 'Venta 30 unidades' },
  ],
  '2': [
    { id: '1', image: '', productName: 'Diseño colección',     category: 'Servicios',         date: new Date('2024-10-10'), amount: 800000,  type: 'expense', description: 'Honorarios diseñador' },
    { id: '2', image: '', productName: 'Camiseta nueva línea', category: 'Ventas',            date: new Date('2024-11-01'), amount: 1200000, type: 'income',  description: 'Pre-venta 20 unidades' },
    { id: '3', image: '', productName: 'Stickers hoja A4',     category: 'Ventas',            date: new Date('2024-11-15'), amount: 500000,  type: 'income',  description: 'Venta 25 hojas' },
    { id: '4', image: '', productName: 'Producción textil',    category: 'Gastos Operativos', date: new Date('2024-11-20'), amount: 1500000, type: 'expense', description: 'Costo producción' },
  ],
  '3': [
    { id: '1', image: '', productName: 'Arriendo stand',       category: 'Gastos Operativos', date: new Date('2025-01-03'), amount: 400000,  type: 'expense', description: 'Arriendo centro comercial' },
    { id: '2', image: '', productName: 'Ventas pop-up',        category: 'Ventas',            date: new Date('2025-01-15'), amount: 1200000, type: 'income',  description: 'Ventas semana 1' },
    { id: '3', image: '', productName: 'Decoración stand',     category: 'Gastos Operativos', date: new Date('2025-01-05'), amount: 150000,  type: 'expense', description: 'Materiales decoración' },
    { id: '4', image: '', productName: 'Ventas cierre',        category: 'Ventas',            date: new Date('2025-01-28'), amount: 600000,  type: 'income',  description: 'Ventas semana final' },
  ],
  '4': [
    { id: '1', image: '', productName: 'Inscripción feria',    category: 'Gastos Operativos', date: new Date('2025-02-12'), amount: 300000,  type: 'expense', description: 'Pago participación' },
    { id: '2', image: '', productName: 'Banner y material',    category: 'Gastos Operativos', date: new Date('2025-02-20'), amount: 250000,  type: 'expense', description: 'Material publicitario' },
    { id: '3', image: '', productName: 'Ventas feria',         category: 'Ventas',            date: new Date('2025-03-15'), amount: 2100000, type: 'income',  description: 'Ventas día del evento' },
    { id: '4', image: '', productName: 'Pack regalo',          category: 'Ventas',            date: new Date('2025-03-15'), amount: 1400000, type: 'income',  description: 'Venta packs especiales' },
  ],
};

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetailComponent implements OnInit {
  project: Project | undefined;
  allEntries: ProjectEntry[] = [];
  filtered: ProjectEntry[] = [];
  categoryFilter = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.project = this.projectsService.getAll().find(p => p.id === id);
    if (!this.project) { this.router.navigate(['/management/projects']); return; }
    this.allEntries = MOCK_ENTRIES[id!] ?? [];
    this.filtered = [...this.allEntries];
  }

  get categories(): string[] {
    return [...new Set(this.allEntries.map(e => e.category))];
  }

  get totalIncome()  { return this.filtered.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0); }
  get totalExpense() { return this.filtered.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0); }
  get netBalance()   { return this.totalIncome - this.totalExpense; }

  applyFilter() {
    this.filtered = this.categoryFilter
      ? this.allEntries.filter(e => e.category === this.categoryFilter)
      : [...this.allEntries];
  }

  statusLabel(s: Project['status']) {
    return { active: 'Activo', paused: 'Pausado', closed: 'Cerrado' }[s];
  }

  goBack() { this.router.navigate(['/management/projects']); }
}
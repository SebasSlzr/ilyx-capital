import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService, ProjectEntry } from '../../../../core/services/projects.service';
import { Project } from '../../../../core/models/project.model';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

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
  showModal = signal(false);

  form: Partial<ProjectEntry> & { dateStr: string } = {
    type: 'income', productName: '', description: '',
    amount: 0, category: '', dateStr: '', image: ''
  };

  readonly entryCategories = ['Ventas', 'Servicios', 'Gastos Operativos', 'Nómina', 'Otros'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.project = this.projectsService.getById(id);
    if (!this.project) { this.router.navigate(['/management/projects']); return; }
    this.loadEntries(id);
  }

  loadEntries(projectId: string) {
    this.allEntries = this.projectsService.getEntriesByProject(projectId);
    this.applyFilter();
  }

  get categories(): string[] { return [...new Set(this.allEntries.map(e => e.category))]; }
  get totalIncome()  { return this.filtered.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);  }
  get totalExpense() { return this.filtered.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0); }
  get netBalance()   { return this.totalIncome - this.totalExpense; }

  applyFilter() {
    this.filtered = this.categoryFilter
      ? this.allEntries.filter(e => e.category === this.categoryFilter)
      : [...this.allEntries];
  }

  openNew() {
    this.form = {
      type: 'income', productName: '', description: '',
      amount: 0, category: this.entryCategories[0],
      dateStr: new Date().toISOString().split('T')[0], image: ''
    };
    this.showModal.set(true);
  }

  save() {
    if (!this.form.productName || !this.form.amount) return;
    this.projectsService.addEntry({
      projectId: this.project!.id,
      image: this.form.image ?? '',
      productName: this.form.productName!,
      category: this.form.category!,
      date: new Date(this.form.dateStr),
      amount: this.form.amount!,
      type: this.form.type!,
      description: this.form.description ?? '',
    });
    this.loadEntries(this.project!.id);
    this.showModal.set(false);
  }

  deleteEntry(id: string) {
    this.projectsService.deleteEntry(id);
    this.loadEntries(this.project!.id);
  }

  statusLabel(s: Project['status']) {
    return { active: 'Activo', paused: 'Pausado', closed: 'Cerrado' }[s];
  }

  goBack() { this.router.navigate(['/management/projects']); }
}
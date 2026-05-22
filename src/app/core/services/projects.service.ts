import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../models/project.model';

const KEY_PROJECTS = 'ilyx_projects';
const KEY_ENTRIES  = 'ilyx_project_entries';

export interface ProjectEntry {
  id: string;
  projectId: string;
  image: string;
  productName: string;
  category: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense';
  description: string;
}

const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Tienda Online',       description: 'Canal de ventas e-commerce propio',      totalIncome: 4700000, totalExpense: 1200000, status: 'active', createdAt: new Date('2024-09-01') },
  { id: '2', name: 'Colección Verano',    description: 'Línea nueva de productos temporada alta', totalIncome: 5100000, totalExpense: 2300000, status: 'active', createdAt: new Date('2024-10-15') },
  { id: '3', name: 'Pop-up Enero',        description: 'Puesto físico en centro comercial',       totalIncome: 1800000, totalExpense: 950000,  status: 'closed', createdAt: new Date('2025-01-05') },
  { id: '4', name: 'Feria Emprendedores', description: 'Participación feria regional marzo 2025', totalIncome: 3500000, totalExpense: 800000,  status: 'paused', createdAt: new Date('2025-02-10') },
];

const MOCK_ENTRIES: ProjectEntry[] = [
  { id: '1', projectId: '1', image: '', productName: 'Camiseta estampada',   category: 'Ventas',            date: new Date('2024-10-15'), amount: 450000,  type: 'income',  description: 'Venta 10 unidades' },
  { id: '2', projectId: '1', image: '', productName: 'Bolsa ecológica',      category: 'Ventas',            date: new Date('2024-10-22'), amount: 180000,  type: 'income',  description: 'Venta 10 unidades' },
  { id: '3', projectId: '1', image: '', productName: 'Envío y logística',    category: 'Gastos Operativos', date: new Date('2024-10-25'), amount: 120000,  type: 'expense', description: 'Costo envíos mes' },
  { id: '4', projectId: '1', image: '', productName: 'Agenda personalizada', category: 'Ventas',            date: new Date('2024-11-05'), amount: 650000,  type: 'income',  description: 'Venta 10 unidades' },
  { id: '5', projectId: '1', image: '', productName: 'Publicidad digital',   category: 'Gastos Operativos', date: new Date('2024-11-10'), amount: 200000,  type: 'expense', description: 'Pauta redes sociales' },
  { id: '6', projectId: '1', image: '', productName: 'Taza cerámica',        category: 'Ventas',            date: new Date('2024-12-01'), amount: 960000,  type: 'income',  description: 'Venta 30 unidades' },
  { id: '7', projectId: '2', image: '', productName: 'Diseño colección',     category: 'Servicios',         date: new Date('2024-10-10'), amount: 800000,  type: 'expense', description: 'Honorarios diseñador' },
  { id: '8', projectId: '2', image: '', productName: 'Camiseta nueva línea', category: 'Ventas',            date: new Date('2024-11-01'), amount: 1200000, type: 'income',  description: 'Pre-venta 20 unidades' },
  { id: '9', projectId: '2', image: '', productName: 'Stickers hoja A4',     category: 'Ventas',            date: new Date('2024-11-15'), amount: 500000,  type: 'income',  description: 'Venta 25 hojas' },
  { id: '10',projectId: '2', image: '', productName: 'Producción textil',    category: 'Gastos Operativos', date: new Date('2024-11-20'), amount: 1500000, type: 'expense', description: 'Costo producción' },
  { id: '11',projectId: '3', image: '', productName: 'Arriendo stand',       category: 'Gastos Operativos', date: new Date('2025-01-03'), amount: 400000,  type: 'expense', description: 'Arriendo centro comercial' },
  { id: '12',projectId: '3', image: '', productName: 'Ventas pop-up',        category: 'Ventas',            date: new Date('2025-01-15'), amount: 1200000, type: 'income',  description: 'Ventas semana 1' },
  { id: '13',projectId: '3', image: '', productName: 'Decoración stand',     category: 'Gastos Operativos', date: new Date('2025-01-05'), amount: 150000,  type: 'expense', description: 'Materiales decoración' },
  { id: '14',projectId: '3', image: '', productName: 'Ventas cierre',        category: 'Ventas',            date: new Date('2025-01-28'), amount: 600000,  type: 'income',  description: 'Ventas semana final' },
  { id: '15',projectId: '4', image: '', productName: 'Inscripción feria',    category: 'Gastos Operativos', date: new Date('2025-02-12'), amount: 300000,  type: 'expense', description: 'Pago participación' },
  { id: '16',projectId: '4', image: '', productName: 'Banner y material',    category: 'Gastos Operativos', date: new Date('2025-02-20'), amount: 250000,  type: 'expense', description: 'Material publicitario' },
  { id: '17',projectId: '4', image: '', productName: 'Ventas feria',         category: 'Ventas',            date: new Date('2025-03-15'), amount: 2100000, type: 'income',  description: 'Ventas día del evento' },
  { id: '18',projectId: '4', image: '', productName: 'Pack regalo',          category: 'Ventas',            date: new Date('2025-03-15'), amount: 1400000, type: 'income',  description: 'Venta packs especiales' },
];

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private projectsSubject: BehaviorSubject<Project[]>;
  private entriesSubject: BehaviorSubject<ProjectEntry[]>;

  constructor() {
    // Proyectos
    const savedP = localStorage.getItem(KEY_PROJECTS);
    const initialP: Project[] = savedP
      ? JSON.parse(savedP).map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) }))
      : MOCK_PROJECTS;
    this.projectsSubject = new BehaviorSubject<Project[]>(initialP);
    this.projectsSubject.subscribe(data => localStorage.setItem(KEY_PROJECTS, JSON.stringify(data)));

    // Entradas de proyectos
    const savedE = localStorage.getItem(KEY_ENTRIES);
    const initialE: ProjectEntry[] = savedE
      ? JSON.parse(savedE).map((e: any) => ({ ...e, date: new Date(e.date) }))
      : MOCK_ENTRIES;
    this.entriesSubject = new BehaviorSubject<ProjectEntry[]>(initialE);
    this.entriesSubject.subscribe(data => localStorage.setItem(KEY_ENTRIES, JSON.stringify(data)));
  }

  get projects$() { return this.projectsSubject.asObservable(); }
  getAll(): Project[] { return this.projectsSubject.getValue(); }
  getById(id: string): Project | undefined { return this.projectsSubject.getValue().find(p => p.id === id); }

  add(project: Omit<Project, 'id' | 'createdAt' | 'totalIncome' | 'totalExpense'>): void {
    const newP: Project = { ...project, id: Date.now().toString(), totalIncome: 0, totalExpense: 0, createdAt: new Date() };
    this.projectsSubject.next([...this.projectsSubject.getValue(), newP]);
  }

  update(id: string, data: Partial<Project>): void {
    this.projectsSubject.next(this.projectsSubject.getValue().map(p => p.id === id ? { ...p, ...data } : p));
  }

  delete(id: string): void {
    this.projectsSubject.next(this.projectsSubject.getValue().filter(p => p.id !== id));
    this.entriesSubject.next(this.entriesSubject.getValue().filter(e => e.projectId !== id));
  }

  // Entradas
  getEntriesByProject(projectId: string): ProjectEntry[] {
    return this.entriesSubject.getValue().filter(e => e.projectId === projectId);
  }

  addEntry(entry: Omit<ProjectEntry, 'id'>): void {
    const newE: ProjectEntry = { ...entry, id: Date.now().toString() };
    this.entriesSubject.next([...this.entriesSubject.getValue(), newE]);
    this.recalcProject(entry.projectId);
  }

  deleteEntry(id: string): void {
    const entry = this.entriesSubject.getValue().find(e => e.id === id);
    this.entriesSubject.next(this.entriesSubject.getValue().filter(e => e.id !== id));
    if (entry) this.recalcProject(entry.projectId);
  }

  // Recalcula totales del proyecto al agregar/eliminar entradas
  private recalcProject(projectId: string): void {
    const entries = this.getEntriesByProject(projectId);
    const totalIncome  = entries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const totalExpense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
    this.update(projectId, { totalIncome, totalExpense });
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../models/project.model';

// ← PERSONALIZAR DATOS: Modificar este array para cambiar los datos de ejemplo
const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Tienda Online',       description: 'Canal de ventas e-commerce propio',          totalIncome: 4700000, totalExpense: 1200000, status: 'active',  createdAt: new Date('2024-09-01') },
  { id: '2', name: 'Colección Verano',    description: 'Línea nueva de productos temporada alta',     totalIncome: 5100000, totalExpense: 2300000, status: 'active',  createdAt: new Date('2024-10-15') },
  { id: '3', name: 'Pop-up Enero',        description: 'Puesto físico en centro comercial',           totalIncome: 1800000, totalExpense: 950000,  status: 'closed',  createdAt: new Date('2025-01-05') },
  { id: '4', name: 'Feria Emprendedores', description: 'Participación feria regional marzo 2025',     totalIncome: 3500000, totalExpense: 800000,  status: 'paused',  createdAt: new Date('2025-02-10') },
];

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private projects = new BehaviorSubject<Project[]>(MOCK_PROJECTS);
  projects$ = this.projects.asObservable();

  getAll(): Project[] { return this.projects.getValue(); }

  add(project: Omit<Project, 'id' | 'createdAt' | 'totalIncome' | 'totalExpense'>): void {
    const newProject: Project = { ...project, id: Date.now().toString(), totalIncome: 0, totalExpense: 0, createdAt: new Date() };
    this.projects.next([...this.projects.getValue(), newProject]);
  }

  update(id: string, data: Partial<Project>): void {
    this.projects.next(this.projects.getValue().map(p => p.id === id ? { ...p, ...data } : p));
  }

  delete(id: string): void {
    this.projects.next(this.projects.getValue().filter(p => p.id !== id));
  }
}
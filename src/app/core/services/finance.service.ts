import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movement } from '../models/movement.model';

// ← PERSONALIZAR DATOS: Modificar este array para cambiar los datos de ejemplo
// ← PERSONALIZAR CATEGORÍAS: Agregar o modificar las categorías disponibles
const CATEGORIES = ['Ventas', 'Servicios', 'Gastos Operativos', 'Nómina', 'Otros'];

const MOCK_MOVEMENTS: Movement[] = [
  { id: '1',  type: 'income',  amount: 1500000, category: 'Ventas',            description: 'Venta productos octubre',        date: new Date('2024-10-15'), projectId: '1' },
  { id: '2',  type: 'expense', amount: 350000,  category: 'Gastos Operativos', description: 'Pago servicios públicos',         date: new Date('2024-10-18') },
  { id: '3',  type: 'income',  amount: 800000,  category: 'Servicios',         description: 'Consultoría diseño web',          date: new Date('2024-10-22'), clientId: '1' },
  { id: '4',  type: 'expense', amount: 120000,  category: 'Otros',             description: 'Compra papelería',               date: new Date('2024-11-02') },
  { id: '5',  type: 'income',  amount: 2200000, category: 'Ventas',            description: 'Venta productos noviembre',       date: new Date('2024-11-10'), projectId: '2' },
  { id: '6',  type: 'expense', amount: 650000,  category: 'Nómina',            description: 'Pago asistente parcial',         date: new Date('2024-11-15') },
  { id: '7',  type: 'income',  amount: 450000,  category: 'Servicios',         description: 'Asesoría contable cliente 2',    date: new Date('2024-11-20'), clientId: '2' },
  { id: '8',  type: 'expense', amount: 280000,  category: 'Gastos Operativos', description: 'Dominio y hosting anual',        date: new Date('2024-11-25') },
  { id: '9',  type: 'income',  amount: 3200000, category: 'Ventas',            description: 'Cierre ventas diciembre',        date: new Date('2024-12-05'), projectId: '1' },
  { id: '10', type: 'expense', amount: 900000,  category: 'Nómina',            description: 'Pago colaborador diciembre',     date: new Date('2024-12-10') },
  { id: '11', type: 'expense', amount: 430000,  category: 'Gastos Operativos', description: 'Renovación suscripciones',       date: new Date('2024-12-12') },
  { id: '12', type: 'income',  amount: 750000,  category: 'Servicios',         description: 'Proyecto branding cliente 3',   date: new Date('2025-01-08'), clientId: '3' },
  { id: '13', type: 'expense', amount: 200000,  category: 'Otros',             description: 'Transporte y viáticos',         date: new Date('2025-01-14') },
  { id: '14', type: 'income',  amount: 1800000, category: 'Ventas',            description: 'Ventas enero temporada alta',    date: new Date('2025-01-20'), projectId: '3' },
  { id: '15', type: 'expense', amount: 540000,  category: 'Gastos Operativos', description: 'Mantenimiento equipos',          date: new Date('2025-01-28') },
  { id: '16', type: 'income',  amount: 620000,  category: 'Servicios',         description: 'Soporte técnico mensual',        date: new Date('2025-02-05'), clientId: '4' },
  { id: '17', type: 'expense', amount: 350000,  category: 'Nómina',            description: 'Honorarios diseñador freelance', date: new Date('2025-02-10') },
  { id: '18', type: 'income',  amount: 2900000, category: 'Ventas',            description: 'Pedido mayorista febrero',       date: new Date('2025-02-18'), projectId: '2' },
  { id: '19', type: 'expense', amount: 175000,  category: 'Otros',             description: 'Publicidad redes sociales',     date: new Date('2025-02-22') },
  { id: '20', type: 'income',  amount: 1100000, category: 'Servicios',         description: 'Consultoría estrategia marzo',  date: new Date('2025-03-03'), clientId: '1' },
  { id: '21', type: 'expense', amount: 480000,  category: 'Gastos Operativos', description: 'Arriendo bodega pequeña',        date: new Date('2025-03-08') },
  { id: '22', type: 'income',  amount: 3500000, category: 'Ventas',            description: 'Feria de emprendimiento marzo',  date: new Date('2025-03-15'), projectId: '4' },
];

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private movements = new BehaviorSubject<Movement[]>(MOCK_MOVEMENTS);
  movements$ = this.movements.asObservable();
  categories = CATEGORIES;

  getAll(): Movement[] { return this.movements.getValue(); }

  add(movement: Omit<Movement, 'id'>): void {
    const current = this.movements.getValue();
    const newMovement: Movement = { ...movement, id: Date.now().toString() };
    this.movements.next([newMovement, ...current]);
  }

  update(id: string, data: Partial<Movement>): void {
    const updated = this.movements.getValue().map(m => m.id === id ? { ...m, ...data } : m);
    this.movements.next(updated);
  }

  delete(id: string): void {
    this.movements.next(this.movements.getValue().filter(m => m.id !== id));
  }

  getRecent(limit = 6): Movement[] {
    return [...this.movements.getValue()]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  getTotalByType(type: 'income' | 'expense'): number {
    return this.movements.getValue()
      .filter(m => m.type === type)
      .reduce((sum, m) => sum + m.amount, 0);
  }
}

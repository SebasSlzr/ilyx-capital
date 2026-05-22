import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../models/client.model';

const KEY = 'ilyx_clients';

const MOCK: Client[] = [
  { id: '1', name: 'Laura Martínez',   email: 'laura@empresa.com',    phone: '311 200 3040', businessType: 'Retail',       totalTransactions: 4, createdAt: new Date('2024-09-01') },
  { id: '2', name: 'Carlos Pérez',     email: 'carlos@estudio.co',    phone: '315 400 1122', businessType: 'Consultoría',  totalTransactions: 2, createdAt: new Date('2024-09-15') },
  { id: '3', name: 'Sofía Ríos',       email: 'sofia@agencia.co',     phone: '320 555 6677', businessType: 'Marketing',    totalTransactions: 3, createdAt: new Date('2024-10-02') },
  { id: '4', name: 'Andrés Gómez',     email: 'andres@tech.io',       phone: '300 123 4567', businessType: 'Tecnología',   totalTransactions: 5, createdAt: new Date('2024-10-20') },
  { id: '5', name: 'Valentina Torres', email: 'val@moda.co',          phone: '312 987 6543', businessType: 'Moda',         totalTransactions: 1, createdAt: new Date('2024-11-05') },
  { id: '6', name: 'Diego Herrera',    email: 'diego@construir.com',  phone: '318 765 4321', businessType: 'Construcción', totalTransactions: 2, createdAt: new Date('2024-11-18') },
  { id: '7', name: 'Natalia Ospina',   email: 'natalia@salud.co',     phone: '321 654 3210', businessType: 'Salud',        totalTransactions: 3, createdAt: new Date('2025-01-10') },
  { id: '8', name: 'Felipe Castillo',  email: 'felipe@logistica.com', phone: '304 321 0987', businessType: 'Logística',    totalTransactions: 2, createdAt: new Date('2025-02-01') },
];

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private clientsSubject: BehaviorSubject<Client[]>;

  constructor() {
    const saved = localStorage.getItem(KEY);
    const initial: Client[] = saved
      ? JSON.parse(saved).map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) }))
      : MOCK;
    this.clientsSubject = new BehaviorSubject<Client[]>(initial);
    this.clientsSubject.subscribe(data => localStorage.setItem(KEY, JSON.stringify(data)));
  }

  get clients$() { return this.clientsSubject.asObservable(); }
  getAll(): Client[] { return this.clientsSubject.getValue(); }

  add(client: Omit<Client, 'id' | 'createdAt' | 'totalTransactions'>): void {
    const newC: Client = { ...client, id: Date.now().toString(), totalTransactions: 0, createdAt: new Date() };
    this.clientsSubject.next([...this.clientsSubject.getValue(), newC]);
  }

  update(id: string, data: Partial<Client>): void {
    this.clientsSubject.next(this.clientsSubject.getValue().map(c => c.id === id ? { ...c, ...data } : c));
  }

  delete(id: string): void {
    this.clientsSubject.next(this.clientsSubject.getValue().filter(c => c.id !== id));
  }
}
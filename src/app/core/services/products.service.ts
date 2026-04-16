import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

// ← PERSONALIZAR DATOS: Modificar este array para cambiar los datos de ejemplo
const MOCK_PRODUCTS: Product[] = [
  { id: '1',  name: 'Camiseta estampada',     description: 'Algodón 100%, varios diseños', price: 45000,  stock: 80,  category: 'Ropa' },
  { id: '2',  name: 'Bolsa tela ecológica',   description: 'Reutilizable, serigrafía',     price: 18000,  stock: 150, category: 'Accesorios' },
  { id: '3',  name: 'Diseño de logo',         description: 'Entrega en 3 días hábiles',   price: 250000, stock: undefined, category: 'Servicios' },
  { id: '4',  name: 'Pack redes sociales',    description: '10 piezas gráficas',           price: 180000, stock: undefined, category: 'Servicios' },
  { id: '5',  name: 'Agenda personalizada',   description: 'Tapa dura, 200 páginas',       price: 65000,  stock: 40,  category: 'Papelería' },
  { id: '6',  name: 'Taza cerámica',          description: 'Sublimación full color',       price: 32000,  stock: 60,  category: 'Accesorios' },
  { id: '7',  name: 'Asesoría 1 hora',        description: 'Consultoría estrategia',       price: 120000, stock: undefined, category: 'Servicios' },
  { id: '8',  name: 'Stickers hoja A4',       description: 'Corte troquelado, 20 unds',    price: 25000,  stock: 200, category: 'Papelería' },
  { id: '9',  name: 'Caja regalo armada',     description: 'Incluye 3 productos',          price: 95000,  stock: 25,  category: 'Ropa' },
  { id: '10', name: 'Banner 100x150cm',       description: 'Lona con estructura',          price: 140000, stock: 15,  category: 'Publicidad' },
];

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private products = new BehaviorSubject<Product[]>(MOCK_PRODUCTS);
  products$ = this.products.asObservable();

  getAll(): Product[] { return this.products.getValue(); }

  add(product: Omit<Product, 'id'>): void {
    this.products.next([...this.products.getValue(), { ...product, id: Date.now().toString() }]);
  }

  update(id: string, data: Partial<Product>): void {
    this.products.next(this.products.getValue().map(p => p.id === id ? { ...p, ...data } : p));
  }

  delete(id: string): void {
    this.products.next(this.products.getValue().filter(p => p.id !== id));
  }
}

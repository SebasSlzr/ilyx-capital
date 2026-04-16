import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../core/models/product.model';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent implements OnInit {
  all: Product[] = [];
  filtered: Product[] = [];
  search = '';
  showModal = signal(false);
  isEditing = false;
  form: Partial<Product> = { name: '', description: '', price: 0, stock: undefined, category: '' };

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.products$.subscribe(data => {
      this.all = data;
      this.applySearch();
    });
  }

  applySearch() {
    this.filtered = this.search
      ? this.all.filter(p => p.name.toLowerCase().includes(this.search.toLowerCase()))
      : [...this.all];
  }

  openNew() {
    this.isEditing = false;
    this.form = { name: '', description: '', price: 0, stock: undefined, category: '' };
    this.showModal.set(true);
  }

  openEdit(p: Product) {
    this.isEditing = true;
    this.form = { ...p };
    this.showModal.set(true);
  }

  save() {
    if (!this.form.name || !this.form.price) return;
    if (this.isEditing && this.form.id) {
      this.productsService.update(this.form.id, this.form);
    } else {
      const { id, ...rest } = this.form as any;
      this.productsService.add(rest);
    }
    this.showModal.set(false);
  }

  delete(id: string) { this.productsService.delete(id); }
}
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientsService } from '../../../core/services/clients.service';
import { Client } from '../../../core/models/client.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class ClientsComponent implements OnInit {
  all: Client[] = [];
  filtered: Client[] = [];
  search = '';
  showModal = signal(false);
  selectedClient: Client | null = null;
  isEditing = false;

  form: Partial<Client> = { name: '', email: '', phone: '', businessType: '' };

  constructor(private clientsService: ClientsService) {}

  ngOnInit() {
    this.clientsService.clients$.subscribe(data => {
      this.all = data;
      this.applySearch();
    });
  }

  applySearch() {
    this.filtered = this.search
      ? this.all.filter(c => c.name.toLowerCase().includes(this.search.toLowerCase()))
      : [...this.all];
  }

  openNew() {
    this.isEditing = false;
    this.form = { name: '', email: '', phone: '', businessType: '' };
    this.showModal.set(true);
  }

  openEdit(c: Client) {
    this.isEditing = true;
    this.form = { ...c };
    this.showModal.set(true);
  }

  openDetail(c: Client) { this.selectedClient = c; }

  save() {
    if (!this.form.name) return;
    if (this.isEditing && this.form.id) {
      this.clientsService.update(this.form.id, this.form);
    } else {
      this.clientsService.add(this.form as any);
    }
    this.showModal.set(false);
  }

  delete(id: string) { this.clientsService.delete(id); }
}
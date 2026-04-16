import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

// ← PERSONALIZAR NEGOCIO: Cambiar el nombre del negocio mostrado en el sidebar
interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: { label: string; route: string }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  financeOpen = signal(false);
  gestionOpen = signal(false);

  navItems: NavItem[] = [
    { label: 'Inicio', icon: '⌂', route: '/dashboard' },
    {
      label: 'Finanzas', icon: '◈',
      children: [
        { label: 'Movimientos', route: '/finance/movements' },
        { label: 'Historial',   route: '/finance/history' },
        { label: 'Balance',     route: '/finance/balance' },
        { label: 'Bancos',      route: '/finance/banks' },
      ]
    },
    {
      label: 'Gestión', icon: '◉',
      children: [
        { label: 'Proyectos', route: '/management/projects' },
        { label: 'Clientes',  route: '/management/clients' },
        { label: 'Productos', route: '/management/products' },
      ]
    },
    { label: 'Perfil', icon: '◎', route: '/profile' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  get user() { return this.auth.getUser(); }

  toggleFinance() { this.financeOpen.update(v => !v); }
  toggleGestion()  { this.gestionOpen.update(v => !v); }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard':             'Inicio',
  '/finance/movements':     'Movimientos',
  '/finance/history':       'Historial',
  '/finance/balance':       'Balance',
  '/finance/banks':         'Bancos',
  '/management/projects':   'Proyectos',
  '/management/clients':    'Clientes',
  '/management/products':   'Productos',
  '/profile':               'Perfil',
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentTitle = 'Inicio';

  constructor(private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.currentTitle = ROUTE_TITLES[e.urlAfterRedirects] ?? 'ILYX Capital';
    });
  }
}
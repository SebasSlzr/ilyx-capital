import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// ← PERSONALIZAR USUARIO: Cambiar nombre, correo y negocio del usuario de prueba
const MOCK_USER = {
  name: 'Sebastián Salazar',
  email: 'sebastian@ilyxcapital.com',
  businessName: 'Mi Negocio',
  phone: '+57 300 000 0000',
  businessType: 'Emprendimiento',
  businessDescription: 'Pequeño negocio de productos y servicios.',
  avatar: null as null
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private user = new BehaviorSubject(MOCK_USER);

  isLoggedIn$ = this.loggedIn.asObservable();
  user$ = this.user.asObservable();

  login(): void { this.loggedIn.next(true); }
  logout(): void { this.loggedIn.next(false); }
  getUser() { return this.user.getValue(); }
  isLoggedIn(): boolean { return this.loggedIn.getValue(); }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const KEY = 'ilyx_user';

interface IlyxUser {
  name: string;
  email: string;
  businessName: string;
  phone: string;
  businessType: string;
  businessDescription: string;
  avatar: null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private user = new BehaviorSubject<IlyxUser | null>(null);

  isLoggedIn$ = this.loggedIn.asObservable();
  user$ = this.user.asObservable();

  constructor() {
    // Si ya hay sesión guardada, restaurarla
    const saved = localStorage.getItem(KEY);
    if (saved) {
      this.user.next(JSON.parse(saved));
      this.loggedIn.next(true);
    }
  }

  register(name: string, email: string, businessName: string): void {
    const newUser: IlyxUser = {
      name,
      email,
      businessName: businessName || 'Mi Negocio',
      phone: '',
      businessType: '',
      businessDescription: '',
      avatar: null
    };
    localStorage.setItem(KEY, JSON.stringify(newUser));
    this.user.next(newUser);
    this.loggedIn.next(true);
  }

  login(): void {
    // Login simple — en app real verificaría credenciales
    const saved = localStorage.getItem(KEY);
    if (saved) {
      this.user.next(JSON.parse(saved));
    }
    this.loggedIn.next(true);
  }

  logout(): void {
    this.loggedIn.next(false);
    this.user.next(null);
    // NO borramos localStorage para que los datos persistan entre sesiones
  }

  getUser(): IlyxUser {
    return this.user.getValue() ?? {
      name: 'Usuario',
      email: '',
      businessName: 'Mi Negocio',
      phone: '',
      businessType: '',
      businessDescription: '',
      avatar: null
    };
  }

  isLoggedIn(): boolean { return this.loggedIn.getValue(); }

  hasRegistered(): boolean { return !!localStorage.getItem(KEY); }
}
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class SignupComponent {
  businessName = '';
  name = '';
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {
    // Si ya está logueado, ir al dashboard
    if (this.auth.isLoggedIn()) this.router.navigate(['/dashboard']);
  }

  signup() {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Por favor completa todos los campos obligatorios.';
      return;
    }
    this.auth.register(this.name, this.email, this.businessName);
    this.router.navigate(['/dashboard']);
  }
}
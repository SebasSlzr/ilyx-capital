import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  editingProfile = false;
  editingBusiness = false;
  currency = 'COP';
  notifications = true;

  user = {
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    businessDescription: '',
    avatar: null as null
  };

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = { ...this.auth.getUser() };
  }

  saveProfile()  { this.editingProfile  = false; }
  saveBusiness() { this.editingBusiness = false; }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
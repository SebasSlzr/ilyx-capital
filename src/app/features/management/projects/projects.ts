import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../../core/services/projects.service';
import { Project } from '../../../core/models/project.model';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  showModal = signal(false);
  form = { name: '', description: '', status: 'active' as Project['status'] };

  constructor(private projectsService: ProjectsService, private router: Router) {}
  ngOnInit() { this.projectsService.projects$.subscribe(p => this.projects = p); }
  goToDetail(id: string) { this.router.navigate(['/management/projects', id]); }

  save() {
    if (!this.form.name) return;
    this.projectsService.add(this.form);
    this.form = { name: '', description: '', status: 'active' };
    this.showModal.set(false);
  }

  statusLabel(s: Project['status']) {
    return { active: 'Activo', paused: 'Pausado', closed: 'Cerrado' }[s];
  }
}
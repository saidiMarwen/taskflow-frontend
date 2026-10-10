import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProjectService } from '../../servicess/project.service';
import { Project } from '../../models/project';
import { AuthService } from '../../servicess/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';



@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  auth = inject(AuthService);

  projects = signal<Project[]>([]);
  error = signal<string | null>(null);

  name = '';
  description = '';
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.projectService.findAll().subscribe({
      next: (data) => this.projects.set(data),
      error: () => this.error.set('Impossible de charger les projets. Le backend est-il lancé ?')
    });
  }

  create(): void {
    if (!this.name.trim()) return;
    this.projectService.create({ name: this.name, description: this.description }).subscribe({
      next: () => {
        this.name = '';
        this.description = '';
        this.load();
        this.snackBar.open('Projet créé ✅', 'OK', { duration: 2500 });
      },
      error: () => this.error.set('Erreur lors de la création.')
    });
  }

  delete(id: number): void {
    this.projectService.delete(id).subscribe({
      next: () => {
        this.load();
        this.snackBar.open('Projet supprimé', 'OK', { duration: 2500 });
      },
      error: () => this.error.set('Erreur lors de la suppression.')
    });
  }
}
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem
} from '@angular/cdk/drag-drop';
import { Project } from '../../models/project';
import { Task, TaskPriority, TaskStatus } from '../../models/task';
import { ProjectService } from '../../servicess/project.service';
import { TaskService } from '../../servicess/task.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../servicess/user.service';
import { UserSummary } from '../../models/user';


@Component({
  selector: 'app-project-board',
  imports: [DragDropModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './project-board.component.html',
  styleUrl: './project-board.component.scss'
})
export class ProjectBoardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  private userService = inject(UserService);
  users: UserSummary[] = [];

  projectId = Number(this.route.snapshot.paramMap.get('id'));
  project = signal<Project | null>(null);
  error = signal<string | null>(null);

  columns: { status: TaskStatus; label: string }[] = [
    { status: 'TODO', label: '📝 À faire' },
    { status: 'IN_PROGRESS', label: '🚧 En cours' },
    { status: 'DONE', label: '✅ Terminé' }
  ];

  // Tableaux classiques (pas des signals) : le CDK les modifie "en place"
  tasks: Record<TaskStatus, Task[]> = { TODO: [], IN_PROGRESS: [], DONE: [] };

  newTitle = '';
  newPriority: TaskPriority = 'MEDIUM';

  ngOnInit(): void {
    this.projectService.findById(this.projectId).subscribe({
      next: (p) => this.project.set(p),
      error: () => this.error.set('Projet introuvable.')
    });
    this.loadTasks();

    this.userService.getUsers().subscribe((u) => (this.users = u));
  }

  loadTasks(): void {
    this.taskService.findByProject(this.projectId).subscribe({
      next: (list) => {
        this.tasks = { TODO: [], IN_PROGRESS: [], DONE: [] };
        list.forEach((t) => this.tasks[t.status].push(t));
      },
      error: () => this.error.set('Impossible de charger les tâches.')
    });
  }

  addTask(): void {
    if (!this.newTitle.trim()) return;
    this.taskService
      .create(this.projectId, { title: this.newTitle, priority: this.newPriority })
      .subscribe({
        next: (task) => {
          this.tasks[task.status].push(task);
          this.newTitle = '';
        },
        error: () => this.error.set('Erreur lors de la création de la tâche.')
      });
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    const task = event.previousContainer.data[event.previousIndex];

    // Mise à jour immédiate de l'écran (optimiste)
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    task.status = newStatus;

    // Puis sauvegarde côté backend ; si ça échoue, on recharge l'état réel
    this.taskService.updateStatus(task.id, newStatus).subscribe({
      error: () => {
        this.error.set('Impossible de déplacer la tâche.');
        this.loadTasks();
      }
    });
  }

  deleteTask(task: Task): void {
    this.taskService.delete(task.id).subscribe({
      next: () => {
        this.tasks[task.status] = this.tasks[task.status].filter((t) => t.id !== task.id);
      },
      error: () => this.error.set('Erreur lors de la suppression.')
    });
  }

  assign(task: Task, userId: number): void {
    this.taskService.assign(task.id, userId).subscribe({
      next: (updated) => {
        task.assigneeId = updated.assigneeId;
        task.assigneeName = updated.assigneeName;
      },
      error: () => this.error.set("Impossible d'assigner la tâche.")
    });
  }
}

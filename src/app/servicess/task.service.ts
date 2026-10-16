import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskRequest, TaskStatus } from '../models/task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private api = '/api';

  findByProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.api}/projects/${projectId}/tasks`);
  }

  create(projectId: number, request: TaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.api}/projects/${projectId}/tasks`, request);
  }

  updateStatus(taskId: number, status: TaskStatus): Observable<Task> {
    return this.http.patch<Task>(`${this.api}/tasks/${taskId}/status`, { status });
  }

  delete(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/tasks/${taskId}`);
  }

  assign(taskId: number, userId: number) {
    return this.http.patch<Task>(`${this.api}/tasks/${taskId}/assignee`, { userId });
  }
}
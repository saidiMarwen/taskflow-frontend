import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectRequest } from '../models/project';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = '/api/projects';

  findAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  create(request: ProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  findById(id: number): Observable<Project> {
  return this.http.get<Project>(`${this.apiUrl}/${id}`);
}
}
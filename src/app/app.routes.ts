import { Routes } from '@angular/router';
import { ProjectBoardComponent } from './pages/project-board/project-board.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: ProjectListComponent, canActivate: [authGuard] },
  { path: 'projects/:id', component: ProjectBoardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];

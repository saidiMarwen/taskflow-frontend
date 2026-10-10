import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './servicess/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    @if (auth.isLoggedIn()) {
      <mat-toolbar class="bar">
        <a routerLink="/" class="brand"><mat-icon>checklist</mat-icon> TaskFlow</a>
        <span class="spacer"></span>
        <span class="user"><mat-icon>account_circle</mat-icon> {{ auth.user()?.username }}</span>
        <button mat-button (click)="auth.logout()">
          <mat-icon>logout</mat-icon> Déconnexion
        </button>
      </mat-toolbar>
    }
    <router-outlet />
  `,
  styles: `
    .bar { background: var(--mat-sys-primary, #4f46e5); color: var(--mat-sys-on-primary, #fff); }
    .bar button { color: inherit; }
    .brand { display: flex; align-items: center; gap: .5rem; color: inherit; text-decoration: none; font-weight: 600; }
    .spacer { flex: 1; }
    .user { display: flex; align-items: center; gap: .4rem; margin-right: 1rem; }
  `
})
export class AppComponent {
  auth = inject(AuthService);
}

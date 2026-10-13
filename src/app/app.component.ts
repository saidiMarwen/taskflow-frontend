import { Component, effect, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from './servicess/auth.service';
import { NotificationService } from './servicess/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule,
            MatIconModule, MatMenuModule, MatBadgeModule],
  template: `
    @if (auth.isLoggedIn()) {
      <mat-toolbar class="bar">
        <a routerLink="/" class="brand"><mat-icon>checklist</mat-icon> TaskFlow</a>
        <span class="spacer"></span>

        <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Notifications">
          <mat-icon [matBadge]="notif.unread()" [matBadgeHidden]="notif.unread() === 0"
                    matBadgeColor="warn">notifications</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          @for (n of notif.notifications(); track n.id) {
            <button mat-menu-item [routerLink]="n.projectId ? ['/projects', n.projectId] : null"
                    (click)="notif.markAsRead(n)">
              <span [style.font-weight]="n.read ? 'normal' : 'bold'">{{ n.message }}</span>
            </button>
          } @empty {
            <button mat-menu-item disabled>Aucune notification</button>
          }
        </mat-menu>

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
    .user { display: flex; align-items: center; gap: .4rem; margin: 0 1rem; }
  `
})
export class AppComponent {
  auth = inject(AuthService);
  notif = inject(NotificationService);

  constructor() {
    effect(() => {
      if (this.auth.isLoggedIn()) this.notif.startPolling();
      else this.notif.stopPolling();
    });
  }
}
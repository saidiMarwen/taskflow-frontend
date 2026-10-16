import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, startWith, switchMap, Subscription, filter } from 'rxjs';
import { AppNotification } from '../models/notification';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private api = 'api/notifications';
  private sub?: Subscription;

  notifications = signal<AppNotification[]>([]);
  unread = signal(0);

  startPolling(): void {
    this.stopPolling();
    this.sub = interval(30000).pipe(
      startWith(0),
      filter(() => document.visibilityState === 'visible'),
      switchMap(() => this.http.get<AppNotification[]>(this.api))
    ).subscribe({
      next: (list) => {
        this.notifications.set(list);
        this.unread.set(list.filter((n) => !n.read).length);
      },
      error: () => { }
    });
  }

  stopPolling(): void {
    this.sub?.unsubscribe();
  }

  markAsRead(n: AppNotification) {
    return this.http.patch<void>(`${this.api}/${n.id}/read`, {}).subscribe(() => {
      this.notifications.update((l) => l.map((x) => x.id === n.id ? { ...x, read: true } : x));
      this.unread.update((c) => Math.max(0, c - 1));
    });
  }
}
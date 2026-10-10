import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicess/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 


@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink,MatCardModule, MatFormFieldModule,
          MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  error = signal<string | null>(null);

  submit(): void {
    this.error.set(null);
    this.auth.register({ username: this.username, email: this.email, password: this.password })
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => this.error.set(err.error?.message ?? "Erreur lors de l'inscription")
      });
  }
}

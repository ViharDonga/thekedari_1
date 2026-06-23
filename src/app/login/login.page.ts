import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { business, lockClosed, person, logIn } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonContent, IonInput, IonButton, IonIcon],
})
export class LoginPage {
  public authService = inject(AuthService);
  public langService = inject(LanguageService);

  public username = '';
  public password = '';
  public errorMessage = signal('');
  public isLoading = signal(false);

  constructor() {
    addIcons({ business, lockClosed, person, logIn });
  }

  submit() {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.login(this.username.trim(), this.password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.authService.handleLoginSuccess(response);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 0) {
          this.errorMessage.set(this.langService.t('backend_offline'));
        } else if (err.status === 404) {
          this.errorMessage.set('API not found. Check server URL configuration.');
        } else {
          const msg = typeof err.error === 'object' && err.error?.message
            ? err.error.message
            : this.langService.t('login_failed');
          this.errorMessage.set(msg);
        }
      },
    });
  }
}

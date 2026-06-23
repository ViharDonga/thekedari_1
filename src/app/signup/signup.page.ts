import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonContent, IonInput, IonButton, IonIcon, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosed, person, personAdd } from 'ionicons/icons';
import { LanguageService } from '../services/language.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
  ],
})
export class SignupPage {
  private http = inject(HttpClient);
  private router = inject(Router);
  public langService = inject(LanguageService);

  public name = '';
  public username = '';
  public password = '';
  public confirmPassword = '';
  public role: 'SUPERVISOR' | 'LABOUR' = 'SUPERVISOR';

  public errorMessage = signal('');
  public successMessage = signal('');
  public isLoading = signal(false);

  constructor() {
    addIcons({ lockClosed, person, personAdd });
  }

  submit() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.name.trim() || !this.username.trim() || !this.password) {
      this.errorMessage.set(this.langService.t('signup_validation'));
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set(this.langService.t('password_min_length'));
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set(this.langService.t('password_mismatch'));
      return;
    }

    this.isLoading.set(true);

    this.http
      .post<{ message: string }>(`${environment.apiUrl}/auth/register`, {
        name: this.name.trim(),
        username: this.username.trim(),
        password: this.password,
        role: this.role,
      })
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.successMessage.set(res.message || this.langService.t('signup_success'));
          setTimeout(() => this.router.navigateByUrl('/login'), 2500);
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.status === 0) {
            this.errorMessage.set(this.langService.t('backend_offline'));
          } else {
            this.errorMessage.set(err.error?.message || this.langService.t('signup_failed'));
          }
        },
      });
  }
}

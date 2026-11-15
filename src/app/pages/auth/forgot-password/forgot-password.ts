import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { AuthPageHeader } from '../components/auth-page-header';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    RouterLink,
    InputText,
    ButtonDirective,
    AuthPageHeader,
  ],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  email = '';

  onSubmit(): void {
    // Handle password reset request
  }
}


import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputPassword } from 'primeng/inputpassword';
import { InputText } from 'primeng/inputtext';
import { Eye } from '@primeicons/angular/eye';
import { EyeSlash } from '@primeicons/angular/eye-slash';
import { AuthPageHeader } from '../components/auth-page-header';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
    InputText,
    InputPassword,
    IconField,
    InputIcon,
    Eye,
    EyeSlash,
    ButtonDirective,
    AuthPageHeader,
  ],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  rememberMe = false;
  isPasswordMasked = true;

  onSubmit(): void {
    // Handle login submission
  }
}

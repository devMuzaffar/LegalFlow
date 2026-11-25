import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Eye } from '@primeicons/angular/eye';
import { EyeSlash } from '@primeicons/angular/eye-slash';
import { ButtonDirective } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputPassword } from 'primeng/inputpassword';
import { InputText } from 'primeng/inputtext';
import { AuthPageHeader } from '../components/auth-page-header';

/** Seed accounts available on the demo login screen. */
export interface DemoRole {
  id: string;
  label: string;
  description: string;
}

/*
   Login

   Login screen: credentials form plus one-tap demo role buttons under the
   "OR TRY DEMO" divider.
*/
@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
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
  // Vars
  private readonly router = inject(Router);

  email = '';
  password = '';
  isPasswordMasked = true;

  readonly demoRoles: DemoRole[] = [
    { id: 'matter-admin', label: 'Matter Admin', description: 'Full workspace access' },
    { id: 'lead-reviewer', label: 'Lead Reviewer', description: 'Document review and coding' },
    {
      id: 'compliance-auditor',
      label: 'Compliance Auditor',
      description: 'Read-only access and audit verification',
    },
  ];

  onSubmit(): void {
    // TODO: authenticate with the entered credentials
  }

  /** Signs in as the selected demo role, then enters the dashboard. */
  onDemoLogin(roleId: string): void {
    // TODO: authenticate as the demo user for this role (no backend yet)
    console.log('demo login:', roleId);
    this.router.navigate(['/overview']);
  }
}

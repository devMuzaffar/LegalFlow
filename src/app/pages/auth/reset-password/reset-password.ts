// Imports
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Eye } from '@primeicons/angular/eye';
import { EyeSlash } from '@primeicons/angular/eye-slash';
import { ButtonDirective } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputPassword } from 'primeng/inputpassword';
import { AuthPageHeader } from '../components/auth-page-header';

// Constants
const MIN_LENGTH = 8;

@Component({
    selector: 'app-reset-password',
    imports: [
        FormsModule,
        RouterLink,
        InputPassword,
        IconField,
        InputIcon,
        Eye,
        EyeSlash,
        ButtonDirective,
        AuthPageHeader,
    ],
    templateUrl: './reset-password.html',
})
export class ResetPassword {
    // Vars
    readonly route = inject(ActivatedRoute);

    /** Token from /auth/reset-password?token=... — null means the link is invalid or expired. */
    readonly token = this.route.snapshot.queryParamMap.get('token');

    readonly password = signal('');
    readonly confirmPassword = signal('');
    readonly passwordMasked = signal(true);
    readonly confirmMasked = signal(true);

    /** Confirm field is only flagged once the user has started typing in it. */
    mismatch = computed(
        () => this.confirmPassword().length > 0 && this.password() !== this.confirmPassword(),
    );

    canSubmit = computed(
        () =>
            !!this.token &&
            this.password().length >= MIN_LENGTH &&
            this.password() === this.confirmPassword(),
    );

    readonly minLength = MIN_LENGTH;

    onSubmit(): void {
        if (!this.canSubmit()) return;
        // TODO: call the auth service with { token, password }
    }
}

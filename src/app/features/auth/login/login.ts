import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/auth/auth';
import { CommonModule } from '@angular/common';
import { StargateService } from '../../../core/services/stargate.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  form: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  apiStatus = signal<'checking' | 'healthy' | 'unhealthy'>('checking');
  apiLabel = environment.apiLabel;

  constructor(private fb: FormBuilder, private auth: Auth, private stargate: StargateService) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.stargate.getHealth().subscribe({
      next: (res) => this.apiStatus.set(res.toLowerCase() === 'healthy' ? 'healthy' : 'unhealthy'),
      error: () => this.apiStatus.set('unhealthy')
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      await this.auth.login(this.form.getRawValue());
    } catch {
      this.errorMessage.set('Invalid username or password.');
    } finally {
      this.loading.set(false);
    }
  }
}

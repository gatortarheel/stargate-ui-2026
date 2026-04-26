import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StargateService } from '../../core/services/stargate.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './health.html',
  styleUrl: './health.scss'
})
export class Health implements OnInit {
  status = signal<'checking' | 'healthy' | 'unhealthy'>('checking');
  apiLabel = environment.apiLabel;
  apiUrl = environment.apiUrl;

  constructor(private stargate: StargateService) {}

  ngOnInit(): void {
    this.check();
  }

  check(): void {
    this.status.set('checking');
    this.stargate.getHealth().subscribe({
      next: (res) => this.status.set(res.toLowerCase() === 'healthy' ? 'healthy' : 'unhealthy'),
      error: () => this.status.set('unhealthy')
    });
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <h1>{{ title }}</h1>
      <p>This page is protected by RBAC. Only users with the required permission can access it.</p>
      <p><strong>Permission Required:</strong> {{ permission }}</p>
    </div>
  `,
  styles: [`
    .placeholder-page {
      padding: 2rem;
      text-align: center;
    }
    h1 {
      color: #212529;
      margin-bottom: 1rem;
    }
    p {
      color: #6c757d;
      margin: 0.5rem 0;
    }
  `]
})
export class PlaceholderComponent {
  private route = inject(ActivatedRoute);
  
  title = this.route.snapshot.data['title'] || 'Page';
  permission = this.route.snapshot.data['permission'] || 'N/A';
}


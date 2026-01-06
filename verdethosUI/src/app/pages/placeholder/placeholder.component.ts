import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <div class="page-header">
        <div class="title-section">
          <div class="title-bar"></div>
          <h1>{{ title }}</h1>
        </div>
      </div>
      <p>This page is protected by RBAC. Only users with the required permission can access it.</p>
      <p><strong>Permission Required:</strong> {{ permission }}</p>
    </div>
  `,
  styles: [`
    .placeholder-page {
      padding: 2rem;
    }
    .page-header {
      margin-bottom: 1.5rem;
    }
    .title-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .title-bar {
      width: 4px;
      height: 1.75rem;
      background-color: #28a745;
      border-radius: 2px;
      flex-shrink: 0;
    }
    h1 {
      color: #212529;
      font-size: 1.75rem;
      font-weight: 600;
      margin: 0;
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


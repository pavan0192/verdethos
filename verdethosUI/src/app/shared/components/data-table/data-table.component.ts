import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {
  @Input() columns: Array<{ key: string; label: string; sortable?: boolean }> = [];
  @Input() data: any[] = [];
  @Input() rowTemplate?: TemplateRef<any>;
}


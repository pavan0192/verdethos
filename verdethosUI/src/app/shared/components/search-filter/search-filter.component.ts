import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.css'
})
export class SearchFilterComponent {
  @Input() searchValue: string = '';
  @Input() activeFilters: Array<{ label: string; value: string }> = [];
  @Output() searchChange = new EventEmitter<string>();
  @Output() removeFilter = new EventEmitter<string>();
  @Output() openFilters = new EventEmitter<void>();
  @Output() openActions = new EventEmitter<void>();

  onSearchChange(value: string) {
    this.searchChange.emit(value);
  }

  onRemoveFilter(value: string) {
    this.removeFilter.emit(value);
  }
}


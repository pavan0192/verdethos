import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatusTab {
  label: string;
  value: string;
  count: number;
}

@Component({
  selector: 'app-status-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-tabs.component.html',
  styleUrl: './status-tabs.component.css'
})
export class StatusTabsComponent {
  @Input() tabs: StatusTab[] = [];
  @Input() activeTab: string = '';
  @Output() tabChange = new EventEmitter<string>();

  selectTab(tabValue: string) {
    if (this.activeTab !== tabValue) {
      this.activeTab = tabValue;
      this.tabChange.emit(tabValue);
    }
  }
}


import { Component, EventEmitter, Input, Output, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface KebabMenuItem {
  label: string;
  action: string;
  icon?: string;
  highlighted?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-kebab-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kebab-menu.component.html',
  styleUrl: './kebab-menu.component.css'
})
export class KebabMenuComponent {
  @Input() items: KebabMenuItem[] = [];
  @Input() menuId: string = '';
  @Output() actionClick = new EventEmitter<string>();

  isOpen = false;
  private activeMenuId: string | null = null;

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      // Close any other open menu
      if (this.activeMenuId && this.activeMenuId !== this.menuId) {
        this.closeMenu();
      }
      this.isOpen = true;
      this.activeMenuId = this.menuId;
    }
  }

  closeMenu() {
    this.isOpen = false;
    if (this.activeMenuId === this.menuId) {
      this.activeMenuId = null;
    }
  }

  onActionClick(action: string, event: Event) {
    event.stopPropagation();
    this.actionClick.emit(action);
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  constructor(private elementRef: ElementRef) {}
}


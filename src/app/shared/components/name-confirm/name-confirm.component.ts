import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-name-confirm',
  imports: [FormsModule],
  templateUrl: './name-confirm.component.html',
  styleUrl: './name-confirm.component.css',
})
export class NameConfirmComponent {
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string>();

  closeModal() {
    this.close.emit();
  }

  apply() {
    this.confirm.emit();
  }
}

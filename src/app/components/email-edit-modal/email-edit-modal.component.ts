import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-edit-modal.component.html',
  styleUrls: ['./email-edit-modal.component.scss']
})
export class EmailEditModalComponent implements OnInit {
  @Input() currentEmail: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();

  newEmail: string = '';

  ngOnInit() {
    this.newEmail = this.currentEmail;
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    this.save.emit(this.newEmail);
  }
}

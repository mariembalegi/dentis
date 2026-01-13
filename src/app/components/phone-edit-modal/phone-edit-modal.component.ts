import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-phone-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './phone-edit-modal.component.html',
  styleUrls: ['./phone-edit-modal.component.scss']
})
export class PhoneEditModalComponent implements OnInit {
  @Input() currentPhone: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();

  newPhone: string = '';

  ngOnInit() {
    this.newPhone = this.currentPhone;
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    this.save.emit(this.newPhone);
  }
}

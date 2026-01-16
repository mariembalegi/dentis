import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  day: string;
  morning: TimeSlot;
  afternoon: TimeSlot;
  isClosed: boolean;
}

@Component({
  selector: 'app-working-hours-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './working-hours-edit-modal.component.html',
  styleUrls: ['./working-hours-edit-modal.component.scss']
})
export class WorkingHoursEditModalComponent {
  @Input() schedule: DaySchedule[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<DaySchedule[]>();

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.save.emit(this.schedule);
  }
}

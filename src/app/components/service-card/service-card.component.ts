import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceMedical } from '../../services/service-medical.service';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent {
  @Input() service!: ServiceMedical;
  @Output() edit = new EventEmitter<ServiceMedical>();
  @Output() delete = new EventEmitter<number>();

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.service);
  }

  onDelete(event: Event) {
    event.stopPropagation();
    if (this.service.numSM) {
        this.delete.emit(this.service.numSM);
    }
  }
}

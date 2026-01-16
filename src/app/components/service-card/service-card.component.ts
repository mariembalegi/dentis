import { Component, Input } from '@angular/core';
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
}

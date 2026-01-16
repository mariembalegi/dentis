import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceMedical } from '../../services/service-medical.service';

@Component({
  selector: 'app-add-service-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-service-modal.component.html',
  styleUrls: ['./add-service-modal.component.scss']
})
export class AddServiceModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<ServiceMedical>();

  formData: Partial<ServiceMedical> = {
    nomSM: '',
    typeSM: '',
    descriptionSM: '',
    tarifSM: undefined,
    image: '' // Optional or default placeholder could be handled
  };

  serviceTypesGroups = [
    {
      name: 'Dentisterie générale',
      types: [
        'Diagnostic et soins courants',
        'Parodontologie',
        'Radiologie et imagerie dentaire'
      ]
    },
    {
      name: 'Actes chirurgicaux',
      types: [
        'Endodontie',
        'Esthétique dentaire',
        'Implantologie'
      ]
    }
  ];

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.formData.nomSM && this.formData.typeSM && this.formData.descriptionSM && this.formData.tarifSM !== undefined) {
      this.add.emit(this.formData as ServiceMedical);
      this.resetForm();
    }
  }

  resetForm() {
    this.formData = {
        nomSM: '',
        typeSM: '',
        descriptionSM: '',
        tarifSM: undefined,
        image: ''
    };
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-details-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-details-edit.component.html',
  styleUrls: ['./patient-details-edit.component.scss']
})
export class PatientDetailsEditComponent {
  @Input() userDetails: any = {}; // Initialize with current user data
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  // Form model (clone of input or default)
  formData = {
    gender: 'Masculin',
    firstName: '',
    lastName: '',
    hasMaidenName: false,
    birthDate: '',
    birthPlace: '',
    recoveryType: '',
    bloodGroup: ''
  };

  ngOnInit() {
    // initialize form with passed data if available
    if (this.userDetails) {
      this.formData = { ...this.formData, ...this.userDetails };
      // Map simple fields if names differ, assuming standard naming for now
      this.formData.gender = 'Masculin'; // Default for demo or map from user
      // Logic to handle specific mapping if needed
    }
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.save.emit(this.formData);
  }
}

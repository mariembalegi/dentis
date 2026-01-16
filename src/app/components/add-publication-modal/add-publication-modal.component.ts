import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-publication-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-publication-modal.component.html',
  styleUrls: ['./add-publication-modal.component.scss']
})
export class AddPublicationModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() publish = new EventEmitter<any>();

  formData = {
    title: '',
    category: '',
    description: '',
    image: null as File | null,
    pdf: null as File | null
  };
  
  imageFileName: string | null = null;
  pdfFileName: string | null = null;

  onClose() {
    this.close.emit();
  }

  onFileSelected(event: any, type: 'image' | 'pdf') {
    const file = event.target.files[0];
    if (file) {
        if (type === 'image') {
            this.formData.image = file;
            this.imageFileName = file.name;
        } else {
            this.formData.pdf = file;
            this.pdfFileName = file.name;
        }
    }
  }

  onSubmit() {
    // If we were real, we'd send FormData. Here we just emit the object.
    console.log('Publishing:', this.formData);
    this.publish.emit(this.formData);
  }
}

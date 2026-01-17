import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicationService, PublicationDTO } from '../../services/publication.service';

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
  isSubmitting = false;

  constructor(private publicationService: PublicationService) {}

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

  /* Helper to convert file to Base64 */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  async onSubmit() {
    if (this.isSubmitting) return;

    if (!this.formData.title || !this.formData.image || !this.formData.pdf) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.isSubmitting = true;

    try {
      // Convert files to Base64
      const imageBase64 = await this.fileToBase64(this.formData.image);
      const pdfBase64 = await this.fileToBase64(this.formData.pdf);

      // Prepare DTO
      const dto: PublicationDTO = {
        titrePub: this.formData.title,
        typePub: this.formData.category,
        description: this.formData.description,
        affichePub: imageBase64, // Image sent as Base64 DataURL
        fichierPub: pdfBase64    // PDF sent as Base64 DataURL
      };

      // Call Service
      this.publicationService.addPublication(dto).subscribe({
        next: (response) => {
          console.log('Publication successful', response);
          alert('Publication ajoutée avec succès ! En attente de validation.');
          this.publish.emit(dto); // Notify parent (maybe to refresh list or just close)
          this.onClose();
        },
        error: (err) => {
          console.error('Error adding publication', err);
          alert('Erreur lors de l\'ajout de la publication. Vérifiez que vous êtes connecté en tant que dentiste.');
          this.isSubmitting = false;
        }
      });

    } catch (e) {
      console.error('File conversion error', e);
      this.isSubmitting = false;
    }
  }
}

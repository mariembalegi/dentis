import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class AddPublicationModalComponent implements OnInit {
  @Input() publicationToEdit: PublicationDTO | null = null;
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

  ngOnInit() {
    if (this.publicationToEdit) {
        this.formData.title = this.publicationToEdit.titrePub;
        this.formData.category = this.publicationToEdit.typePub;
        this.formData.description = this.publicationToEdit.description;
        
        if (this.publicationToEdit.affichePub) {
            this.imageFileName = "Image actuelle conservée";
        }
        if (this.publicationToEdit.fichierPub) {
            this.pdfFileName = "PDF actuel conservé (ajouter pour modifier)";
        }
    }
  }

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

    // Validation
    const isEdit = !!this.publicationToEdit;
    if (!this.formData.title || !this.formData.category) {
        alert('Veuillez remplir les champs Titre et Catégorie.');
        return;
    }
    
    // If NOT edit, need files. If edit, files are optional (keep old).
    if (!isEdit && (!this.formData.image || !this.formData.pdf)) {
      alert('Veuillez ajouter une image et un PDF.');
      return;
    }

    this.isSubmitting = true;

    try {
      // Convert files to Base64 (or keep old)
      let imageBase64 = this.publicationToEdit?.affichePub;
      if (this.formData.image) {
          imageBase64 = await this.fileToBase64(this.formData.image);
      }

      let pdfBase64 = this.publicationToEdit?.fichierPub;
      if (this.formData.pdf) {
          pdfBase64 = await this.fileToBase64(this.formData.pdf);
      }

      // Prepare DTO
      const dto: PublicationDTO = {
        titrePub: this.formData.title,
        typePub: this.formData.category,
        description: this.formData.description,
        affichePub: imageBase64, 
        fichierPub: pdfBase64   
      };

      const editId = this.publicationToEdit?.idPub || this.publicationToEdit?.id;

      if (isEdit && editId) {
          // UPDATE
          this.publicationService.updatePublication(editId, dto).subscribe({
            next: (response) => {
              alert('Publication modifiée avec succès ! Elle doit être revalidée.');
              this.publish.emit(dto);
              this.onClose();
            },
            error: (err) => {
              console.error('Error updating', err);
              alert(err.error || 'Erreur lors de la modification.');
              this.isSubmitting = false;
            }
          });
      } else {
          // ADD
          this.publicationService.addPublication(dto).subscribe({
            next: (response) => {
              alert('Publication ajoutée avec succès ! En attente de validation.');
              this.publish.emit(dto);
              this.onClose();
            },
            error: (err) => {
              console.error('Error adding publication', err);
              alert('Erreur lors de l\'ajout de la publication.');
              this.isSubmitting = false;
            }
          });
      }

    } catch (e) {
      console.error('File conversion error', e);
      this.isSubmitting = false;
    }
  }
}

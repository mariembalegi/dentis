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
  @Input() isDentist: boolean = false;
  @Input() isAdmin: boolean = false;
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
    bloodGroup: '',
    speciality: '',
    city: '',
    delegation: '',
    address: ''
  };

  delegationsOptions: string[] = [];

  tunisiaData: any = {
    "Tunis": {
      "Carthage": ["Carthage", "Amilcar", "Carthage Byrsa", "Carthage Plage"],
      "La Marsa": ["La Marsa", "Gammarth", "Sidi Daoud", "Marsa Ville"],
      "Le Bardo": ["Le Bardo", "Bardo Nord", "Ksar Said"],
      "Sidi Bou Said": ["Sidi Bou Said"],
      "Centre Ville": ["Lafayette", "Montplaisir", "Avenue Habib Bourguiba"],
      "El Menzah": ["El Menzah 1", "El Menzah 4", "El Menzah 9", "Mutuelleville"],
    },
    "Ariana": {
      "Ariana Ville": ["Ariana", "Nouvelle Ariana", "Ariana Supérieure", "Menzah 8"],
      "La Soukra": ["La Soukra", "Chotrana 1", "Chotrana 2", "Chotrana 3", "Sidi Frej"],
      "Raoued": ["Raoued", "Riadh Andalous", "Ghazela"],
      "Ettadhamen": ["Ettadhamen", "Cité El Bassatine"],
      "Mnihla": ["Mnihla", "Cité El Refaha"]
    },
    "Ben Arous": {
      "Hammam Lif": ["Hammam Lif", "Bou Kornine"],
      "Radès": ["Radès", "Radès Méliane", "Radès Forêt"],
      "Ezzahra": ["Ezzahra", "Borj Cedria"],
      "Megrine": ["Megrine Coteaux", "Megrine Chaker", "Sidi Rezig"],
      "Mourouj": ["Mourouj 1", "Mourouj 3", "Mourouj 5", "Mourouj 6"]
    },
    "Manouba": {
        "Manouba": ["Manouba", "Denden"],
        "Oued Ellil": ["Oued Ellil", "Cité El Ward"],
        "Tebourba": ["Tebourba"],
        "Mornaguia": ["Mornaguia"]
    },
    "Nabeul": {
        "Nabeul": ["Nabeul", "Les Deux Oueds"],
        "Hammamet": ["Hammamet Nord", "Hammamet Sud", "Yasmine Hammamet"],
        "Dar Chaabane": ["Dar Chaabane El Fehri"],
        "Kelibia": ["Kelibia"],
        "Grombalia": ["Grombalia"]
    },
    "Zaghouan": { "Zaghouan": ["Zaghouan Ville"] },
    "Bizerte": { "Bizerte Nord": ["Bizerte"], "Zarzouna": ["Zarzouna"] },
    "Béja": { "Béja Nord": ["Béja"] },
    "Jendouba": { "Jendouba Nord": ["Jendouba"] },
    "Le Kef": { "Kef Ouest": ["Le Kef"] },
    "Siliana": { "Siliana Nord": ["Siliana"] },
    "Sousse": {
      "Sousse Ville": ["Sousse", "Boujaffar", "Khezama", "Sahloul"],
      "Hammam Sousse": ["Hammam Sousse", "El Kantaoui"],
      "Msaken": ["Msaken", "Beni Kalthoum"],
      "Kalaa Kebira": ["Kalaa Kebira"],
      "Akouda": ["Akouda"]
    },
    "Monastir": {
        "Monastir": ["Monastir", "Skanes"],
        "Moknine": ["Moknine"],
        "Jammel": ["Jammel"],
        "Ksar Hellal": ["Ksar Hellal"]
    },
    "Mahdia": { "Mahdia": ["Mahdia Ville", "Hiboun"] },
    "Sfax": {
      "Sfax Ville": ["Sfax", "Bab Bhar", "Sfax El Jadida"],
      "Sakiet Ezzit": ["Sakiet Ezzit", "Sidi Saleh"],
      "Sakiet Eddaier": ["Sakiet Eddaier"],
      "Thyna": ["Thyna"],
      "El Hencha": ["El Hencha"]
    },
    "Kairouan": { "Kairouan Nord": ["Kairouan"] },
    "Kasserine": { "Kasserine Nord": ["Kasserine"] },
    "Sidi Bouzid": { "Sidi Bouzid Ouest": ["Sidi Bouzid"] },
    "Gabès": { "Gabès Médina": ["Gabès"] },
    "Médenine": { "Médenine Nord": ["Médenine"], "Djerba Houmt Souk": ["Houmt Souk"] },
    "Tataouine": { "Tataouine Nord": ["Tataouine"] },
    "Gafsa": { "Gafsa Nord": ["Gafsa"] },
    "Tozeur": { "Tozeur": ["Tozeur Ville"] },
    "Kébili": { "Kébili Nord": ["Kébili"] }
  };

  ngOnInit() {
    // initialize form with passed data if available
    if (this.userDetails) {
      this.formData = { ...this.formData, ...this.userDetails };
      
      // Init delegations if city exists
      if (this.formData.city && this.tunisiaData[this.formData.city]) {
        this.delegationsOptions = Object.keys(this.tunisiaData[this.formData.city]);
      }
    }
  }

  onGouvernoratChange() {
    this.formData.delegation = '';
    
    if (this.formData.city && this.tunisiaData[this.formData.city]) {
      this.delegationsOptions = Object.keys(this.tunisiaData[this.formData.city]);
    } else {
      this.delegationsOptions = [];
    }
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.save.emit(this.formData);
  }
}

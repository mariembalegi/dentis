import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientDetailsEditComponent } from '../../components/patient-details-edit/patient-details-edit.component';
import { AuthService, User } from '../../services/auth.service';
import { WorkingHoursEditModalComponent, DaySchedule } from '../../components/working-hours-edit-modal/working-hours-edit-modal.component';

@Component({
  selector: 'app-patient-profile-details',
  standalone: true,
  imports: [CommonModule, RouterLink, PatientDetailsEditComponent, WorkingHoursEditModalComponent],
  templateUrl: './patient-profile-details.component.html',
  styleUrls: ['./patient-profile-details.component.scss']
})
export class PatientProfileDetailsComponent implements OnInit {
  user: any = {
    // Default fallback
    firstName: 'Mohamed Achref',
    lastName: 'ABDELBARI',
    maidenName: 'ABDELBARI',
    birthPlace: "l'étranger (Tunisie)",
    birthDate: '14/12/1996',
    age: 29,
    address: "16 Rue etienne jules marey , bois d'Arcy , 78390 BOIS D ARCY, Tunis",
    recoveryType: 'Remboursement',
    bloodGroup: 'A',
    gender: 'Masculin',
    speciality: 'Chirurgien Dentiste',
    city: 'Tunis',
    adminType: 'Super Admin' 
  };

  showEditModal = false;
  showHoursEditModal = false;
  isDentist = false;
  isAdmin = false;

  workingHours: DaySchedule[] = [
    { day: 'Lundi', morning: { start: '09:00', end: '13:00' }, afternoon: { start: '14:00', end: '18:00' }, isClosed: false },
    { day: 'Mardi', morning: { start: '09:00', end: '13:00' }, afternoon: { start: '14:00', end: '18:00' }, isClosed: false },
    { day: 'Mercredi', morning: { start: '09:00', end: '13:00' }, afternoon: { start: '14:00', end: '18:00' }, isClosed: false },
    { day: 'Jeudi', morning: { start: '09:00', end: '13:00' }, afternoon: { start: '14:00', end: '18:00' }, isClosed: false },
    { day: 'Vendredi', morning: { start: '09:00', end: '13:00' }, afternoon: { start: '14:00', end: '17:00' }, isClosed: false },
    { day: 'Samedi', morning: { start: '09:00', end: '13:00' }, afternoon: { start: '', end: '' }, isClosed: false },
    { day: 'Dimanche', morning: { start: '', end: '' }, afternoon: { start: '', end: '' }, isClosed: true }
  ];

  constructor(private authService: AuthService, private location: Location) {}

  ngOnInit() {
    this.authService.user$.subscribe(currentUser => {
      if (currentUser) {
        this.isDentist = currentUser.role === 'DENTISTE';
        this.isAdmin = currentUser.role === 'ADMIN';

        // Map AuthService user to local user structure
        this.user.firstName = currentUser.prenom || this.user.firstName;
        this.user.lastName = currentUser.nom || this.user.lastName;
        this.user.birthDate = currentUser.dateNaissanceP || this.user.birthDate;
        
        // Calculate age dynamically
        this.user.age = this.calculateAge(this.user.birthDate);

        // Handle gender mapping or heuristic
        if (currentUser.sexe) {
             // Normalize backend value if necessary (e.g. if back returns 'F' or 'FEMME')
             const sexeUpper = currentUser.sexe.toUpperCase();
             if (sexeUpper.startsWith('F') || sexeUpper === 'WOMAN') {
                 this.user.gender = 'Féminin';
             } else {
                 this.user.gender = 'Masculin';
             }
        } else {
            // Heuristic for Ryma/Rima if data is missing
            const nameLower = this.user.firstName.toLowerCase();
            if (nameLower.includes('ryma') || nameLower.includes('rima') || nameLower.includes('mariem')) {
                 this.user.gender = 'Féminin';
            } else {
                 this.user.gender = 'Masculin'; // Fallback
            }
        }
        
        // Keep other fields as hardcoded/default for now as they might not be in User interface
      }
    });
  }

  calculateAge(birthDateString: string): number {
    if (!birthDateString) return 0;
    
    let birthDate: Date;
    
    // Check if format is DD/MM/YYYY (e.g. 14/12/1996)
    if (birthDateString.includes('/')) {
      const parts = birthDateString.split('/');
      // assuming day/month/year
      birthDate = new Date(+parts[2], +parts[1] - 1, +parts[0]);
    } else {
      // standard YYYY-MM-DD
      birthDate = new Date(birthDateString);
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  get initials(): string {
    return (this.user.firstName.charAt(0) + this.user.lastName.charAt(0)).toUpperCase();
  }

  formatSchedule(schedule: DaySchedule): string {
    if (schedule.isClosed) return 'Fermé';
    
    let morning = '';
    if (schedule.morning.start && schedule.morning.end) {
        morning = `${schedule.morning.start} - ${schedule.morning.end}`;
    }

    let afternoon = '';
    if (schedule.afternoon.start && schedule.afternoon.end) {
        afternoon = `${schedule.afternoon.start} - ${schedule.afternoon.end}`;
    }

    if (morning && afternoon) return `${morning} / ${afternoon}`;
    return morning || afternoon || 'Fermé';
  }

  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  goBack() {
    this.location.back();
  }

  saveDetails(updatedData: any) {
    // Merge updatedData into local user object or call service
    console.log('Saved data:', updatedData);
    // Be consistent with property names. The modal sends formData which matches keys partially.
    // Ideally we map them back.
    if (updatedData) {
        this.user.firstName = updatedData.firstName;
        this.user.lastName = updatedData.lastName;
        this.user.birthDate = updatedData.birthDate;
        this.user.birthPlace = updatedData.birthPlace;
        this.user.recoveryType = updatedData.recoveryType;
        this.user.bloodGroup = updatedData.bloodGroup;
        this.user.gender = updatedData.gender;
        this.user.speciality = updatedData.speciality;
        this.user.city = updatedData.city;
        this.user.delegation = updatedData.delegation;
        this.user.address = updatedData.address;

        // Recalculate age if birthdate changed
        this.user.age = this.calculateAge(this.user.birthDate);
    }
    this.closeEditModal();
  }

  openHoursEditModal() {
    this.showHoursEditModal = true; 
  }

  closeHoursEditModal() {
      this.showHoursEditModal = false;
  }

  saveHours(updatedHours: DaySchedule[]) {
      this.workingHours = updatedHours;
      this.closeHoursEditModal();
  }
}

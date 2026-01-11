import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {}

import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, InfoCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {
  @Input() title: string = '';
  @Input() buttonText: string = '';
  @Input() imageSrc: string = '';
  @Input() imageAlt: string = '';
  @Input() link: string = '';
}
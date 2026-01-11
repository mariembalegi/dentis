import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDateMask]',
  standalone: true
})
export class DateMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = event.target as HTMLInputElement;
    // Extraire uniquement les chiffres
    const digitsOnly = input.value.replace(/\D/g, '');
    
    // Limiter à 8 chiffres (jjmmaaaa)
    const digits = digitsOnly.substring(0, 8);
    
    // Formater avec séparateurs
    let formatted = '';
    if (digits.length > 0) {
      formatted = digits.substring(0, 2);
    }
    if (digits.length > 2) {
      formatted += ' / ' + digits.substring(2, 4);
    } else if (digits.length > 1 && digits.length <= 2) {
      formatted += ' / mm / aaaa';
    }
    if (digits.length > 4) {
      formatted += ' / ' + digits.substring(4, 8);
    } else if (digits.length > 2 && digits.length <= 4) {
      formatted += ' / aaaa';
    }
    
    input.value = formatted;
  }

  @HostListener('blur', ['$event'])
  onBlur(event: any) {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '');

    if (digitsOnly.length === 0) {
      input.value = '';
    } else {
      const digits = digitsOnly.substring(0, 8);
      let formatted = '';
      
      if (digits.length > 0) {
        formatted = digits.substring(0, 2);
      }
      if (digits.length > 2) {
        formatted += ' / ' + digits.substring(2, 4);
      } else if (digits.length >= 2) {
        formatted += ' / mm / aaaa';
      }
      if (digits.length > 4) {
        formatted += ' / ' + digits.substring(4, 8);
      } else if (digits.length > 2) {
        formatted += ' / aaaa';
      }
      
      input.value = formatted;
    }
  }

  @HostListener('focus', ['$event'])
  onFocus(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      input.value = 'jj / mm / aaaa';
    }
  }
}





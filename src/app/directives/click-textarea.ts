import { Directive, HostListener, ElementRef } from '@angular/core';
import { MainComponent } from '../components/main.component/main.component';


@Directive({
  selector: 'textarea'
})
export class ClickTextarea {

  // Inyectamos ElementRef por si necesitas acceder al valor o propiedades físicas del textarea
  constructor(
    private textarea: ElementRef<HTMLTextAreaElement>,
    private main: MainComponent
  ) { }

  // Captura el evento 'click' del textarea
  @HostListener('click', ['$event'])
  alHacerClic(event: MouseEvent) {
    console.log('Se hizo clic en un textarea:', event);

    // Ejemplo: Acceder al valor actual del textarea que recibió el clic
    const valorActual = this.textarea.nativeElement.value;
    console.log('Contenido actual:', valorActual);

    this.main.textareaSeleccionada.set(this.textarea.nativeElement);
  }


}

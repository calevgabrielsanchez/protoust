import { Component } from '@angular/core';
import {
  faSave, faFileHalfDashed, faGlobe, faBook, faEarthAmericas, faScroll, faImage,
  faCircleInfo, faSquarePlus, faBaby, faDragon, faMeteor, faSkullCrossbones, faTrashCan, faPenFancy,
  faDownload, faUpload, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { TextPlusComponent } from '../text-plus.component/text-plus.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-mente.component',
  imports: [TextPlusComponent,FaIconComponent],
  templateUrl: './mente.component.html',
  styleUrl: './mente.component.css',
})
export class MenteComponent {
  faSave = faSave;
  faFileHalfDashed = faFileHalfDashed;
  faGlobe = faGlobe;
  faBook = faBook;
  faEarthAmericas = faEarthAmericas;
  faScroll = faScroll;
  faImage = faImage;
  faCircleInfo = faCircleInfo;
  faSquarePlus = faSquarePlus;
  faBaby = faBaby;
  faDragon = faDragon;
  faMeteor = faMeteor;
  faSkullCrossbones = faSkullCrossbones;
  faTrashCan = faTrashCan;
  faPenFancy = faPenFancy;
  faDownload = faDownload;
  faUpload = faUpload;
  faRefresh = faRefresh;

  mostrarTextPlus: boolean = false;
  textoAEditar: string = "";

  cerrar() {
    this.closeTextPlus(this.textoAEditar);
  }

  private closeTextPlus(resolvedValue: string) {
    this.mostrarTextPlus = false;
   /* if (this.textPlusPromiseResolver) {
      this.textPlusPromiseResolver(resolvedValue);
      this.textPlusPromiseResolver = null;
    }*/
  }

  aceptar() {
   /* const elementoTextarea = this.textareaSeleccionada();

    if (elementoTextarea) {
      elementoTextarea.value = this.textoAEditar;
      elementoTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    this.closeTextPlus(this.textoAEditar);*/
  }

  abrirEditarText() {
   // this.textoAEditar = this.textareaSeleccionada()?.value || '';
    this.mostrarTextPlus = true;
  }

  onClickCaleVRije(){
    window.location.href = '/';
  }
  onClickCreatividad(){
    window.location.href = '/creatividad';
  }

}

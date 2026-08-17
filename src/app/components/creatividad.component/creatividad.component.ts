import { Component, inject, Signal, signal } from '@angular/core';
import {
  faSave, faFileHalfDashed, faGlobe, faBook, faEarthAmericas, faScroll, faImage,
  faCircleInfo, faSquarePlus, faBaby, faDragon, faMeteor, faSkullCrossbones, faTrashCan, faPenFancy,
  faDownload, faUpload, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { TextPlusComponent } from '../text-plus.component/text-plus.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-creatividad.component',
  imports: [TextPlusComponent,FaIconComponent],
  templateUrl: './creatividad.component.html',
  styleUrl: './creatividad.component.css',
})
export class CreatividadComponent {

  private http = inject(HttpClient);

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

  palabras = signal<any[]>([]);
  datosConvertidos: any[] = [];

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

  onClickMente(){
    window.location.href = '/mente';
  }

  onGenerarPalabras(){
    this.http.get('/csv/verbos.csv', { responseType: 'text' }).subscribe({
      next: (csvText) => {
        this.datosConvertidos = this.convertirCsvAObjeto(csvText);
        console.log('Objetos generados:', this.datosConvertidos);
        this.palabras.set(this.obtenerElementosAleatorios(this.datosConvertidos,5));
      },
      error: (err) => console.error('Error al leer el CSV:', err)
    });
  }

  private convertirCsvAObjeto(texto: string): any[] {
    // Separar por saltos de línea (\r\n o \n)
    const lineas = texto.trim().split(/\r?\n/);
    if (lineas.length === 0) return [];

    // La primera línea contiene los encabezados (propiedades del objeto)
    const encabezados = lineas[0].split(',').map(h => h.trim());
    const resultados: any[] = [];

    // Recorrer el resto de las líneas (los datos)
    for (let i = 1; i < lineas.length; i++) {
      const valores = lineas[i].split(',').map(v => v.trim());
      const objetoTemporal: any = {};

      encabezados.forEach((encabezado, index) => {
        objetoTemporal[encabezado] = valores[index] || '';
      });

      resultados.push(objetoTemporal);
    }

    return resultados;
  }

  obtenerElementosAleatorios(datos: any[], n: number): any[] {
  // Hacemos una copia del arreglo original para no mutarlo directamente
  const copia = [...datos];
  
  // Algoritmo de mezcla de Fisher-Yates
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  
  // Devolvemos la cantidad 'n' solicitada (limitada al tamaño total del arreglo)
  return copia.slice(0, n);
}

}

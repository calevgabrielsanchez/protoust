import { Component, Output, EventEmitter, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSave,faFileHalfDashed,faGlobe,faBook,faEarthAmericas, faScroll, faImage,
  faCircleInfo, faSquarePlus, faBaby, faDragon, faMeteor,faSkullCrossbones, faTrashCan, faPenFancy, faSquareCheck, faCode, faSquareXmark } from '@fortawesome/free-solid-svg-icons'; 


@Component({
  selector: 'app-text-plus',
  imports: [FormsModule, FaIconComponent],
  templateUrl: './text-plus.component.html',
  styleUrl: './text-plus.component.css',
})
export class TextPlusComponent implements OnInit {
/*****************
 * Variables de Iconos
 */
faScroll = faScroll;
faSquareCheck = faSquareCheck;
faCode = faCode;
faSquareXmark = faSquareXmark;

/****
 * Variables Internas
 */
  textoContenido = model<string>('');
  textoArea: string = ""
  vistaPergamino: string = ""
  code: boolean = true
  @Output() cerrar = new EventEmitter<void>();
  @Output() aceptar = new EventEmitter<void>();

  ngOnInit(): void {
    this.textoArea = this.textoContenido()
    this.convertirPergamino()
  }

  guardarYAceptar() {
    this.textoContenido.set(this.textoArea)
    this.aceptar.emit()
  }

  convertirPergamino() {
    this.code = true
    if(this.textoArea!=''&&this.textoArea!=null&&this.textoArea!=undefined){
const lineas: string[] = this.textoArea.split(/\r?\n/);
    let convertirdo = ""
    let cierre = ''

    lineas.forEach((linea, index) => {
      const lineaLimpia = linea.trim();
      const primerCaracter = lineaLimpia.substring(0, 1)
      const segundoCaracter = lineaLimpia.substring(1, 2)
      const lengthLinea = lineaLimpia.length
      const ultimoCaracter = lineaLimpia.substring((lengthLinea - 1), lengthLinea)


      switch (primerCaracter) {
        case '#':
          if (segundoCaracter == '#') {
            convertirdo += '<em>' + lineaLimpia.substring(2, lengthLinea) + "</em></br>"
          } else if (segundoCaracter == '/') {
            convertirdo += '<a href="' + lineaLimpia.substring(2, lengthLinea) + '" target="_blank">' + lineaLimpia.substring(2, lengthLinea) + '</a>'
          }
          else {
            convertirdo += '<b>' + lineaLimpia.substring(1, lengthLinea) + "</b></br>"
          }
          break;
        case '(':
          if (segundoCaracter == '#') {
            if (ultimoCaracter == ')') {
              cierre = ''
              convertirdo += '<div class="red">' + lineaLimpia.substring(2, (lengthLinea - 1)) + "</div>"
            } else {
              cierre = "</div>"
              convertirdo += '<div class="red">' + lineaLimpia.substring(2, lengthLinea) + "<br/>"
            }
          } else if (segundoCaracter == '@') {
            if (ultimoCaracter == ')') {
              cierre = ''
              convertirdo += '<div class="yellow">' + lineaLimpia.substring(2, (lengthLinea - 1)) + "</div>"
            } else {
              cierre = "</div>"
              convertirdo += '<div class="yellow">' + lineaLimpia.substring(2, lengthLinea) + "<br/>"
            }
          } else if (segundoCaracter == '!') {
            if (ultimoCaracter == ')') {
              cierre = ''
              convertirdo += '<div class="green">' + lineaLimpia.substring(2, (lengthLinea - 1)) + "</div>"
            } else {
              cierre = "</div>"
              convertirdo += '<div class="green">' + lineaLimpia.substring(2, lengthLinea) + "<br/>"
            }
          } else if (segundoCaracter == '?') {
            if (ultimoCaracter == ')') {
              cierre = ''
              convertirdo += '<div class="blue">' + lineaLimpia.substring(2, (lengthLinea - 1)) + "</div>"
            } else {
              cierre = "</div>"
              convertirdo += '<div class="blue">' + lineaLimpia.substring(2, lengthLinea) + "<br/>"
            }
          } else if (segundoCaracter == '/') {
            if (ultimoCaracter == ')') {
              cierre = ''
              convertirdo += '<div class="grey">' + lineaLimpia.substring(2, (lengthLinea - 1)) + "</div>"
            } else {
              cierre = "</div>"
              convertirdo += '<div class="grey">' + lineaLimpia.substring(2, lengthLinea) + "<br/>"
            }
          }
          break;
        case '-':
          if (segundoCaracter == '-') {
            convertirdo += '<dd class="dd">' + lineaLimpia.substring(2, (lengthLinea)) + "</dd>"
          } else {
            cierre = '</dl>'
            convertirdo += '<dl><dt class="dt">' + lineaLimpia.substring(1, (lengthLinea)) + '</dt>'
          }
          break;
        default:
          if (cierre == '</dl>') {
            convertirdo += cierre + '<br/>'
            cierre = ''
            convertirdo += lineaLimpia + '<br/>'
          } else {
            convertirdo += lineaLimpia + '<br/>'
          }
          break;
      }
      if (ultimoCaracter == ')') {
        convertirdo += cierre
        cierre = ''
      }
    });
    this.vistaPergamino = convertirdo
    }
    
  }
  convertirCodigo() {
    this.code = false
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PalabraService } from 'src/app/services/palabra.service';
import { SignificadoService } from 'src/app/services/significado.service';
import { DialogData } from '../word.component';
import { Tipo } from 'src/app/models/tipo.model';
import { TipoService } from 'src/app/services/tipo.service';

@Component({
  selector: 'app-word-update',
  templateUrl: './word-update.component.html',
  //styleUrls: ['./word-update.component.css']
})
export class WordUpdateComponent implements OnInit {
  // Variables para almacenar los datos de la palabra seleccionada
  contenido: string;
  dificultad: string;
  aprendido: boolean;
  codTipo: string;
  idPalabraFrase: number;
  updateForm: FormGroup;
  significadosForm: FormGroup; // Nuevo formulario para los significados
  dificultadOptions: string[] = ['Easy', 'Medium', 'Hard'];
  significado: {
    descripcion: String,
    idPalabraFrase: Number,
  } = {
      descripcion: '',
      idPalabraFrase: 0,
    };
  significadosObtenidos: any[] = []; // Inicializa con los obtenidos
  significadosNuevos: string[] = [];
  significadosMap: Map<number, string> = new Map<number, string>(); // Usar un mapa para rastrear los significados
  tipoOptions: Tipo[];

  constructor(
    public dialogRef: MatDialogRef<WordUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private palabraService: PalabraService,
    private snackBar: MatSnackBar,
    private significadoService: SignificadoService,
    private tipoService: TipoService,
  ) { }

  ngOnInit(): void {
    // Inicializa las variables con los datos de la palabra seleccionada
    this.contenido = this.data.contenido;
    this.dificultad = this.data.dificultad;
    this.aprendido = this.data.aprendido;
    this.codTipo = this.data.codTipo;
    this.idPalabraFrase = this.data.idPalabraFrase;

    // Inicializa el formulario reactivo
    this.updateForm = this.formBuilder.group({
      contenido: [this.contenido, Validators.required],
      dificultad: [this.dificultad, Validators.required],
      aprendido: [this.aprendido],
      codTipo: ['', Validators.required],
      significado: []

    });

    // Inicializa el formulario para los significados
    this.significadosForm = this.formBuilder.group({
      significado: ['', Validators.required],
    });

    // Obtén los significados desde el backend
    this.significadoService.getSignificadosByPalabraId(this.data.idPalabraFrase)
      .subscribe((significados: any[]) => {
        // Mapea los objetos de significado al mapa usando el ID como clave
        this.significadosMap = new Map<number, string>(
          significados.map(significado => [significado.idSignificado, significado.descripcion])
        );
        console.log("significados obtenidos:", this.significadosMap);

        // Inicializa la lista de significados obtenidos
        this.significadosObtenidos = significados;
      });

    // Llama al método para cargar los tipos
    this.loadTipos();
  }

  // Método para manejar la acción de enviar el formulario principal
  formSubmit() {
    if (this.updateForm.valid) {
      const updatedData = this.updateForm.value;
      this.palabraService.updatePalabra(this.idPalabraFrase, updatedData)
        .subscribe(() => {
          //Se agregar el id de la palabra al nuevo significado
          if (this.significadosNuevos.length > 0) {
            this.significado.idPalabraFrase = this.data.idPalabraFrase
            for (const significa of this.significadosNuevos) {
              this.significado.descripcion = significa,

                console.log("Significado: ", significa)
              console.log('ID :', this.significado.idPalabraFrase);
              // Utiliza el servicio para registrar el significado
              this.significadoService.registrarSignificado(this.significado).subscribe(result => {
                console.log('Significado registrado con éxito', result);
              });
            }

          }
          // Cierra el diálogo si la actualización es exitosa
          this.dialogRef.close(updatedData);
        }, (error) => {
          // Maneja los errores aquí, por ejemplo, muestra un mensaje de error
          this.snackBar.open('Error al actualizar la palabra.', 'Cerrar', {
            duration: 2000,
          });
          console.error(error);
        });
    } else {
      // Muestra un mensaje de error si el formulario principal no es válido
      this.snackBar.open('Por favor, complete el formulario principal correctamente.', 'Cerrar', {
        duration: 2000,
      });
    }
  }

  // Método para manejar la acción de enviar el formulario para agregar significados
  addSignificado() {
    // Agregar el significado al array y limpiar el campo de entrada
    const significado_array = this.updateForm.get('significado')?.value;
    if (significado_array) {
      this.significadosNuevos.push(significado_array);
      this.updateForm.get('significado')?.setValue('');
    }
    console.log("Agregado", this.significadosNuevos)
  }

  // Método para eliminar significados (obtenidos o nuevos)
  removeSignificado(idSignificado: number, index: number) {
    // Llama al servicio para eliminar el significado del backend si es un significado obtenido
    if (idSignificado) {
      this.significadoService.eliminarSignificado(idSignificado).subscribe(
        () => {
          // Significado obtenido eliminado del backend, ahora elimínalo del arreglo local y del mapa
          this.significadosObtenidos.splice(index, 1);
          this.significadosMap.delete(idSignificado);
        },
        (error) => {
          // Maneja los errores aquí, por ejemplo, muestra un mensaje de error
          console.error(error);
        }
      );
    } else {
      // Si el ID del significado es falso (0 o null), elimínalo solo del arreglo local de nuevos significados
      this.significadosNuevos.splice(index, 1);
    }
  }
  removeSignificadoNuevo(index: number) {
    // Eliminar un significado por índice
    this.significadosNuevos.splice(index, 1);
  }

  loadTipos() {
    this.tipoService.getTipoPorCategoria(1).subscribe((tipos: Tipo[]) => {
      this.tipoOptions = tipos;
    });
    console.log('tipoOptions:', this.tipoOptions);

  }

  cancelar() {
    // Cierra el diálogo sin guardar nada
    this.dialogRef.close();
  }
}

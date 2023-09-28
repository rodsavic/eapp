import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PalabraService } from 'src/app/services/palabra.service';
import { DialogData } from '../word.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignificadoService } from 'src/app/services/significado.service';
import { TipoService } from 'src/app/services/tipo.service';
import { Tipo } from 'src/app/models/tipo.model';
import { TypeComponent } from '../../type/type.component';


@Component({
  selector: 'app-word-create',
  templateUrl: './word-create.component.html',
  //styleUrls: ['./word-create.component.css']
})
export class WordCreateComponent implements OnInit {

  /*data: DialogData = {
    contenido: '',
    dificultad: '',
    aprendido: false,
    codTipo: '',
    idCategoria:1
  };*/
  idCategoria = 1;
  significado: {
    descripcion: String,
    idPalabraFrase: Number,
  } = {
      descripcion: '',
      idPalabraFrase: 0,
    };

  //tipo: number;
  //id_palabra: 0;
  dificultadOptions: string[] = ['Easy', 'Medium', 'Hard'];
  tipoOptions: Tipo[];
  significados: string[] = [];
  significado_array: string[] = [];
  form: FormGroup;


  constructor(private palabraService: PalabraService,
    private dialogRef: MatDialogRef<WordCreateComponent>,
    private snack: MatSnackBar,
    private fb: FormBuilder,
    private significadoService: SignificadoService,
    private tipoService: TipoService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // Configurar el formulario reativo
    // Campos de entrada
    this.form = this.fb.group({
      contenido: ['', Validators.required],
      dificultad: ['', Validators.required],
      aprendido: [false],
      codTipo: ['', Validators.required],
      significado: [''],


    });

    this.form.get('tipo')?.valueChanges.subscribe(value => {
      console.log('Tipo seleccionado:', value);
    });
    // Llama al método para cargar los tipos
    this.loadTipos();

  }
  formSubmit() {
    const formData = {
      contenido: this.form.get('contenido')?.value || '', // Usar un valor por defecto si es nulo
      dificultad: this.form.get('dificultad')?.value || '',
      aprendido: this.form.get('aprendido')?.value || false, // Usar un valor por defecto si es nulo
      codTipo: this.form.get('codTipo')?.value || '',
    };

    var significado = this.significados;
    //console.log("Significado 1: ",this.form.get('significado'))
    console.log("Significado: ", significado)
    console.log("formData: ", formData);
    this.palabraService.registrarPalabra(formData).subscribe(response => {
      console.log('Palabra registrada con éxito', response);
      this.dialogRef.close(response);
      this.snack.open('Word saved', 'Aceptar ', {
        duration: 3000
      });



      this.palabraService.getPalabraFraseIdByContenido(formData.contenido).subscribe(idPalabraFrase => {
        // Ahora puedes usar id_palabra para registrar los significados
        this.significado.idPalabraFrase = idPalabraFrase;
        console.log('ID de palabra obtenido:', this.significado.idPalabraFrase);
        for (const significa of significado) {
          this.significado.descripcion = significa,

            console.log("Significado: ", significa)
          console.log('ID :', this.significado.idPalabraFrase);
          // Utiliza el servicio para registrar el significado
          this.significadoService.registrarSignificado(this.significado).subscribe(result => {
            console.log('Significado registrado con éxito', result);
          });
        }

      })
    });
  }

  loadTipos() {
    this.tipoService.getTipoPorCategoria(1).subscribe((tipos: Tipo[]) => {
      this.tipoOptions = tipos;
    });
    console.log('tipoOptions:', this.tipoOptions);

  }

  addSignificado() {
    // Agregar el significado al array y limpiar el campo de entrada
    const significado_array = this.form.get('significado')?.value;
    if (significado_array) {
      this.significados.push(significado_array);
      this.form.get('significado')?.setValue('');
    }
  }

  removeSignificado(index: number) {
    // Eliminar un significado por índice
    this.significados.splice(index, 1);
  }

  cancelar() {
    // Cierra el diálogo sin guardar nada
    this.dialogRef.close();
  }

  // Función para abrir el diálogo de creacion de palabra
  openTypeCreateDialog(): void {
    const dialogRef = this.dialog.open(TypeComponent, {
      width: '40%',
      height: '40%',
      data:this.idCategoria,
      //data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { DialogData } from '../word.component';
import { Tipo } from 'src/app/models/tipo.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PalabraService } from 'src/app/services/palabra.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoService } from 'src/app/services/tipo.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TypeComponent } from '../../type/type.component';

@Component({
  selector: 'app-phrase-create',
  templateUrl: './phrase-create.component.html',
  //styleUrls: ['./phrase-create.component.css']
})
export class PhraseCreateComponent implements OnInit{
  
  data: DialogData = {
    contenido: '',
    dificultad: '',
    aprendido: false,
    codTipo: '',
    idCategoria:2
  };


  //tipo: number;
  //id_palabra: 0;
  dificultadOptions: string[] = ['Easy', 'Medium', 'Hard'];
  tipoOptions: Tipo[];
  form: FormGroup;
  idCategoria:number;

  constructor(
    private palabraService: PalabraService,
    private dialogRef: MatDialogRef<PhraseCreateComponent>,
    private snack: MatSnackBar,
    private fb: FormBuilder,
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

  console.log("formData: ", formData);
    this.palabraService.registrarPalabra(formData).subscribe(response => {
      console.log('Frase registrada con éxito', response);
      this.dialogRef.close(response);
      this.snack.open('Word saved', 'Aceptar ', {
        duration: 3000
      });
    });
  }

  loadTipos() {
    this.tipoService.getTipoPorCategoria(2).subscribe((tipos: Tipo[]) => {
      this.tipoOptions = tipos;
    });
    console.log('tipoOptions:', this.tipoOptions);

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
      data: this.idCategoria=2,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

}

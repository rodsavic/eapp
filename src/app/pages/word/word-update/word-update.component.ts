import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PalabraService } from 'src/app/services/palabra.service';
import { SignificadoService } from 'src/app/services/significado.service';
import { DialogData } from '../word.component';

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
  idTipo: number;
  idPalabraFrase: number;
  updateForm: FormGroup;
  dificultadOptions: string[] = ['Easy', 'Medium', 'Hard'];
  significados: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<WordUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private palabraService: PalabraService, // Puedes agregar otros servicios si es necesario
    private snackBar: MatSnackBar,
    private significadoService: SignificadoService
  ) { }

  ngOnInit(): void {
    // Inicializa las variables con los datos de la palabra seleccionada
    this.contenido = this.data.contenido;
    this.dificultad = this.data.dificultad;
    this.aprendido = this.data.aprendido;
    this.idTipo = this.data.idTipo;
    this.idPalabraFrase = this.data.idPalabraFrase;
    // Inicializa el formulario reactivo
    this.updateForm = this.formBuilder.group({
      contenido: [this.contenido, Validators.required],
      dificultad: [this.dificultad, Validators.required],
      aprendido: [this.aprendido],
      // Agrega otros campos aquí si es necesario
    });
    
    this.significadoService.getSignificadosByPalabraId(this.data.idPalabraFrase)
    .subscribe((significados: any[]) => {
      this.significados = significados;
    });
    console.log("significados obtenidos:",this.significados)
    
  }
  // Método para manejar la acción de enviar el formulario
  formSubmit() {
    if (this.updateForm.valid) {
      // Realiza aquí la lógica para actualizar la palabra con los datos del formulario
      // Puedes utilizar this.updateForm.value para obtener los valores del formulario
      // Luego, cierra el diálogo si la actualización es exitosa
      this.dialogRef.close(this.updateForm.value);
    } else {
      // Muestra un mensaje de error si el formulario no es válido
      this.snackBar.open('Por favor, complete el formulario correctamente.', 'Cerrar', {
        duration: 2000,
      });
    }
  }
  cancelar() {
    // Cierra el diálogo sin guardar nada
    this.dialogRef.close();
  }

}

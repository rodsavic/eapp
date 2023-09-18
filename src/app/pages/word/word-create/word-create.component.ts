import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PalabraService } from 'src/app/services/palabra.service';
import { DialogData } from '../word.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignificadoService } from 'src/app/services/significado.service';


@Component({
  selector: 'app-word-create',
  templateUrl: './word-create.component.html',
  //styleUrls: ['./word-create.component.css']
})
export class WordCreateComponent implements OnInit {

  data: DialogData = {
    contenido: '',
    dificultad: '',
    aprendido: false,
    idTipo: 1,
  };

  significado: {
    descripcion: String,
    idPalabraFrase: Number,
  }= {
    descripcion: '',
    idPalabraFrase: 0,
  };
  //id_palabra: 0;
  dificultadOptions: string[] = ['Easy', 'Medium', 'Hard'];
  significados: string[] = [];
  significado_array: string[] = [];
  form: FormGroup;


  constructor(private palabraService: PalabraService,
    private dialogRef: MatDialogRef<WordCreateComponent>,
    private snack: MatSnackBar,
    private fb: FormBuilder,
    private significadoService: SignificadoService) { }

  ngOnInit(): void {
    // Configurar el formulario reativo
    this.form = this.fb.group({
      contenido: ['', Validators.required],
      dificultad: ['', Validators.required],
      aprendido: [false],

      significado: [''], // Campo de entrada de significado
    });
    
  }
  formSubmit() {
    const formData = {
      contenido: this.form.get('contenido')?.value || '', // Usar un valor por defecto si es nulo
      dificultad: this.form.get('dificultad')?.value || '',
      aprendido: this.form.get('aprendido')?.value || false, // Usar un valor por defecto si es nulo
      idTipo: 1,
     
    };

    var significado =  this.significados;
    //console.log("Significado 1: ",this.form.get('significado'))
    console.log("Significado: ",significado)
    console.log("formDara: ", formData);
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



      // Puedes realizar otras acciones aquí después de guardar los datos
      //this.dialogRef.close(response); // Cierra el cuadro de diálogo y pasa la respuesta al componente padre
    });
    /*
    this.palabraService.getPalabraFraseIdByContenido(formData.contenido).subscribe(id_palabra => {
      // Ahora puedes usar id_palabra para registrar los significados
      console.log('ID de palabra obtenido:', id_palabra);
    
      // Registra cada significado
      
      //const idPalabra = response.id;
      //console.log("idPalabra ", idPalabra)
      // Resto del código...
    });*/
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
}

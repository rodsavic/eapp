import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Sentence } from 'src/app/models/sentence.model';
import { SentenceService } from 'src/app/services/sentence.service';

@Component({
  selector: 'app-create-sentece',
  templateUrl: './create-sentece.component.html',
  //styleUrls: ['./create-sentece.component.css']
})
export class CreateSenteceComponent {
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateSenteceComponent>,
    private sentenceService: SentenceService
  ){}

  //Lanza error pero funciona igual
  oracion: Sentence = new Sentence();
  
 //oracion.texto='';

  formSubmit() {
    this.oracion.idPalabraFrase = this.data["id"];
    this.sentenceService.setSentence(this.oracion).subscribe(response => {
      console.log('Oracion registrada: ', response);
      this.dialogRef.close(); // Cierra el diálogo cuando se completa la petición
    }, error => {
      console.error('Error registrando oracion: ', error);
    });
  }
  
  cancelar() {
    // Cierra el diálogo sin guardar nada
    this.dialogRef.close();
  }

}

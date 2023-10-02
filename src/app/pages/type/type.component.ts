import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TipoService } from 'src/app/services/tipo.service';
import { Tipo } from 'src/app/models/tipo.model';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  //styleUrls: ['./type.component.css']
})
export class TypeComponent implements OnInit{

  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<TypeComponent>,
    private tipoService: TipoService,
  ){}
  
  tipo: Tipo = new Tipo('','',this.data);

  ngOnInit(): void {
    
  }
  
  formSubmit() {
    //Se pone en mayuscula
    this.tipo.descripcion = this.tipo.descripcion.toUpperCase();

    this.tipoService.registrarTipo(this.tipo).subscribe(response => {
      console.log('Tipo registrado: ', response);
      this.dialogRef.close(); // Cierra el diálogo cuando se completa la petición
    }, error => {
      console.error('Error registrando tipo: ', error);
    });
  }
  
  cancelar() {
    // Cierra el diálogo sin guardar nada
    this.dialogRef.close();
  }
}

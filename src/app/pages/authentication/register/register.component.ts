import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class AppSideRegisterComponent {
  userData = {
      nombreUsuario: '', 
      nombre: '',
      apellido: '',
      contrasenha: '',
      confirmarContrasenha: ''
  };
  //registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService, 
    private snack:MatSnackBar,) { }
  ngOnInit(): void {
  }
  formSubmit() {
    if (this.userData.contrasenha !== this.userData.confirmarContrasenha) {
      // Las contraseñas no coinciden, muestra un mensaje de error o realiza alguna acción apropiada.
      console.error('Las contraseñas no coinciden');
      this.snack.open('Las contraseñas no coinciden , vuelva a intentar !!','Aceptar',{
        duration:3000
      })
      return;
    }
    this.userService.registrarUsuario(this.userData).subscribe(response => {
      console.log('Usuario registrado con éxito:', response);
      this.router.navigate(['authentication/login']);
   // Aquí puedes redirigir al usuario a la página de inicio de sesión u otra página
    });
  }
  /*
  // Método para registrar al usuario cuando se envía el formulario
  registerUser() {
    if (this.registerForm.valid) {
      // Si el formulario es válido, puedes enviar los datos al servidor aquí
      const userData = this.registerForm.value;
      console.log('Datos del usuario a registrar:', userData);

      // Puedes hacer una llamada HTTP para enviar los datos al servidor aquí
      // Ejemplo de llamada HTTP ficticia:
      this.userService.registrarUsuario(userData).subscribe(response => {
         console.log('Usuario registrado con éxito:', response);
         this.router.navigate(['/login']);
      // Aquí puedes redirigir al usuario a la página de inicio de sesión u otra página
    });
    }
  }*/
}

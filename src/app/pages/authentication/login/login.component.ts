import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  //styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  userData = {
    username: '',
    password: ''
  };

  errorMessage: string = 'ERROR!!'; // Declarar la propiedad errorMessage
  
  constructor(private snack:MatSnackBar,private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
  }
  formSubmit() {
    console.log('Ingresa al formSybmit')
    const { username, password } = this.userData;
    if(this.userData.username.trim() == '' || this.userData.username.trim() == null){
      console.log('Ingresa al primer if')
      this.snack.open('El nombre de usuario es requerido !!','Aceptar',{
        duration:3000
      })
      return;
    }
    if(this.userData.password.trim() == '' || this.userData.password.trim() == null){
      console.log('Ingresa al segundo if')
      this.snack.open('La contraseña es requerida !!','Aceptar',{
        duration:3000
      })
      return;
    }
    /*
    this.authService.login(username, password).subscribe(
      (token: string) => { // Asegurarse de que el tipo sea 'string'
        // Manejar la respuesta del backend
        console.log(token);
        if (token) {
          // El inicio de sesión fue exitoso, guarda el token en localStorage o en una cookie
          localStorage.setItem('token', token);
          // Redirige al usuario a la página principal o a otra página protegida
          this.router.navigate(['/home']); // Ajusta la ruta según tus necesidades
        } else {
          // El inicio de sesión falló, muestra un mensaje de error
          this.errorMessage = 'Credenciales inválidas';
        }
      },
      (error) => {
        // Manejar errores aquí
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = 'Error al iniciar sesión';
      }
    );*/
    this.authService.generateToken(this.userData).subscribe(
      (data:any) => {
        console.log("this.authService.generateToken ",data);
        this.authService.loginUser(data.token);
        this.authService.setUser(username);
        console.log(username);
        this.router.navigate(['/']); // Redirige a la ruta deseada
        /*this.authService.getCurrentUser().subscribe((user:any) => {
          this.authService.setUser(user);
          console.log(user);

          if(this.authService.getUserRole() == 'ADMIN'){
            //dashboard admin
            //window.location.href = '/admin';
            this.router.navigate(['admin']);
            this.authService.loginStatusSubjec.next(true);
          }
          else if(this.authService.getUserRole() == 'NORMAL'){
            //user dashboard
            //window.location.href = '/user-dashboard';
            this.router.navigate(['user-dashboard']);
            this.authService.loginStatusSubjec.next(true);
          }
          else{
            this.authService.logout();
          }
          
        })*/
      },(error) => {
        console.log(error);
        this.snack.open('Detalles inválidos , vuelva a intentar !!','Aceptar',{
          duration:3000
        })
      }
    )  
  }
}  


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private backendUrl = 'http://localhost:8081/usuarios'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) {}

  // Método para registrar un usuario en el backend
  registrarUsuario(userData: any): Observable<any> {
    const url = `${this.backendUrl}/createUsuario`; 
    return this.http.post(url, userData);
  }
}

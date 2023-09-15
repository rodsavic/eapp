import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

export class PalabraService {
private backendUrl = 'http://localhost:8081'; // Reemplaza con la URL de tu backend

constructor(private http: HttpClient) {}

// Método para registrar un usuario en el backend
registrarPalabra(data: any): Observable<any> {
    const url = `${this.backendUrl}/palabrafrases`; 
    return this.http.post(url, data);
}
}
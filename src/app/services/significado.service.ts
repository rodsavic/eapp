import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class SignificadoService {
  private backendUrl = 'http://localhost:8081'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para registrar un significado en el backend
  registrarSignificado(data: any): Observable<any> {
    const url = `${this.backendUrl}/significados`;
    return this.http.post(url, data);
  }
  /*
  // Método para obtener el ID de una palabra o frase por su contenido
  getPalabraFraseIdByContenido(contenido: string): Observable<number> {
    const url = `${this.backendUrl}/buscarPorContenido/${contenido}`;
    return this.http.get<number>(url);
  }
  */
}


import { HttpClient, HttpParams  } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class PalabraService {
  private backendUrl = 'http://localhost:8081/palabrafrases'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para registrar una palabra en el backend
  registrarPalabra(data: any): Observable<any> {
    const url = `${this.backendUrl}/`;
    return this.http.post(url, data);
  }

  // Metodo para actualizar palabra
  updatePalabra(id: number, data: any): Observable<any> {
    const url = `${this.backendUrl}/${id}`;
    return this.http.put(url, data);
  }

  //Metodo para eliminar palabra
  eliminarPalabra(id: number): Observable<any> {
    const url = `${this.backendUrl}/${id}`;
    return this.http.delete(url);
  }


  getPalabra(): Observable<any> {
    const url = `${this.backendUrl}/`;

    return this.http.get(url);
  }

  filtrarPalabra(filter: any): Observable<any> {
    const url = `${this.backendUrl}/buscar`;

    // Construir los parámetros de búsqueda según los valores del filtro
    let params = new HttpParams();
    if (filter.word) {
      params = params.set('contenido', filter.word);
    }
    if (filter.level) {
      params = params.set('dificultad', filter.level);
    }
    if (filter.learned) {
      params = params.set('aprendido', filter.learned);
    }
    if (filter.codTipo) {
      params = params.set('codTipo', filter.codTipo);
    }
    if (filter.startDate) {
      params = params.set('fechaInicio', filter.startDate.toISOString());
    }
    if (filter.endDate) {
      params = params.set('fechaFin', filter.endDate.toISOString());
    }

    if (filter.idCategoria){
      params = params.set('idCategoria', filter.idCategoria);
    }

    return this.http.get(url, { params });
  }

  // Método para obtener el ID de una palabra o frase por su contenido
  getPalabraFraseIdByContenido(contenido: string): Observable<number> {
    const url = `${this.backendUrl}/buscarPorContenido/${contenido}`;
    return this.http.get<number>(url);
  }

}


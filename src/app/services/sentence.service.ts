import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sentence } from '../models/sentence.model';

@Injectable({
  providedIn: 'root'
})
export class SentenceService {

  private backendUrl = 'http://localhost:8081/oraciones';

  constructor(private http: HttpClient) { }

  getSentence(id: number): Observable<any> {
    const url = `${this.backendUrl}/palabra/${id}`;

    return this.http.get(url);
  }

  // Método para registrar una oracion en el backend
  setSentence(data: Sentence): Observable<any> {
    const url = `${this.backendUrl}/`;
    return this.http.post(url, data);
  }

  // Metodo para actualizar oracion
  updateSentence(id: number, data: Sentence): Observable<any> {
    const url = `${this.backendUrl}/${id}`;
    return this.http.put(url, data);
  }

  //Metodo para eliminar oracion
  deleteSentence(id: number): Observable<any> {
    const url = `${this.backendUrl}/${id}`;
    return this.http.delete(url);
  }
}

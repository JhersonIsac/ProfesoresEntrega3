import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlUsuarios = 'http://localhost:3000/usuarios';
  private urlAsignaturas = 'http://localhost:3000/asignaturas';
  private urlClases = 'http://localhost:3000/clases';

  constructor(private http: HttpClient) {}

  // ======== Métodos de usuarios ========

  // Método para registrar un nuevo usuario
  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.urlUsuarios, usuario).pipe(
      catchError(this.handleError)
    );
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(this.urlUsuarios).pipe(
      map(users => {
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        } else {
          throw new Error('Usuario o contraseña incorrectos');
        }
      }),
      catchError((error) => {
        console.error('Error en login:', error);
        return throwError(error);
      })
    );
  }

  // Obtener el usuario actualmente logueado
  getUsuarioLogueado(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('currentUser');
  }

  // Obtener todos los usuarios
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.urlUsuarios).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar usuario
  actualizarUsuario(usuario: any): Observable<any> {
    return this.http.put(`${this.urlUsuarios}/${usuario.id}`, usuario).pipe(
      catchError(this.handleError)
    );
  }

  // ======== Métodos de asignaturas ========

  // Obtener todas las asignaturas
  getAsignaturas(): Observable<any[]> {
    return this.http.get<any[]>(this.urlAsignaturas).pipe(
      catchError(this.handleError)
    );
  }

  // Agregar una nueva asignatura
  agregarAsignatura(asignatura: any): Observable<any> {
    return this.http.post(this.urlAsignaturas, asignatura).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar una asignatura existente
  actualizarAsignatura(asignatura: any): Observable<any> {
    return this.http.put(`${this.urlAsignaturas}/${asignatura.id}`, asignatura).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar una asignatura
  eliminarAsignatura(id: string): Observable<any> {
    return this.http.delete(`${this.urlAsignaturas}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ======== Métodos de clases ========

  // Obtener todas las clases
  getClases(): Observable<any[]> {
    return this.http.get<any[]>(this.urlClases).pipe(
      catchError(this.handleError)
    );
  }

  // Registrar una nueva clase
  registrarClase(clase: any): Observable<any> {
    return this.http.post(this.urlClases, clase).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar una clase existente
  actualizarClase(clase: any): Observable<any> {
    return this.http.put(`${this.urlClases}/${clase.id}`, clase).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar una clase
  eliminarClase(id: string): Observable<any> {
    return this.http.delete(`${this.urlClases}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ======== Manejo de errores ========

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}

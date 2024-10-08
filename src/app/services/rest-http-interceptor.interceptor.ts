import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class RestHttpInterceptorInterceptor implements HttpInterceptor {

  constructor(private toastrService: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        console.log(event);
      }),
      catchError((error: HttpErrorResponse) => {
        let errMessage = this._setError(error);
        this.toastrService.error(errMessage);
        return throwError(error);
      })
    );

  }


  private _setError(error: HttpErrorResponse | ErrorEvent) {
    let errorMessage: string = "";
    if (error instanceof ErrorEvent) {
      //handle client end errors
      console.log(error);
    } else {
      if (error.status !== 0 && error.error) {
        let httpErrorMessage = error.error.message ? error.error.message : '';
        errorMessage = httpErrorMessage !== '' ? error.status + " - " + error.error.error + ': ' + httpErrorMessage : error.status + " - " + error.error.error;
      } else {
        errorMessage = error.status + " - " + error.statusText;
      }

    }
    return errorMessage;
  }
}

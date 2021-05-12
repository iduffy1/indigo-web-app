import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry, tap } from "rxjs/operators";

export class ErrorInterceptor implements HttpInterceptor {
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        console.log("Outgoing http request");
        console.log(request);
        return next.handle(request).pipe(
            tap(
                (event: HttpEvent<any>) => {
                    console.log("Intercept event response:");
                    console.log(event);
                },
                (event: HttpErrorResponse) => {
                    console.log("Intercept error response:");
                    console.log(event);
                }
            ),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = "";
                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    // server-side error
                    if (error.error)
                        errorMessage = error.error;
                    else
                        errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
                }
                console.log(errorMessage);
                return throwError(errorMessage);
            })
        );
    }
}

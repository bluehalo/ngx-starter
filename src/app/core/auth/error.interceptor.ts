import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';

import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

type HttpError = { status: number; type: string; url: string; message: string };

export type HttpErrorHandlerFn = (err: HttpError, req: HttpRequest<unknown>) => boolean;

// eslint-disable-next-line rxjs/finnish
export function errorInterceptor(
	req: HttpRequest<unknown>,
	next: HttpHandlerFn,
	errorHandler: HttpErrorHandlerFn
): Observable<HttpEvent<unknown>> {
	return next(req).pipe(
		catchError((err: unknown) => {
			if (errorHandler(parseError(err), req)) {
				return EMPTY;
			}
			return throwError(() => err);
		})
	);
}

function parseError(err: any): HttpError {
	const status = err?.status ?? 200;
	const type = err?.error?.type ?? '';
	const url = err?.url ?? '';
	const message = err?.error?.message ?? '';

	return { status, type, message, url };
}

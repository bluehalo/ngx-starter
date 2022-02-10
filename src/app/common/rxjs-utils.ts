import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

function inputIsNotNullOrUndefined<T>(input: null | undefined | T): input is T {
	return input !== null && input !== undefined;
}
export function isNotNullOrUndefined<T>() {
	return (source$: Observable<null | undefined | T>) =>
		source$.pipe(filter(inputIsNotNullOrUndefined));
}

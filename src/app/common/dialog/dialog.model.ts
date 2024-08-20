import { filterNil } from 'ngxtension/filter-nil';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export enum DialogAction {
	OK,
	CANCEL
}

export class DialogReturn<T = void> {
	action: DialogAction;
	data?: T;
}

export function isDialogActionOK<T>() {
	return (source$: Observable<DialogReturn<T> | undefined>) =>
		source$.pipe(
			filterNil(),
			filter((result) => result.action === DialogAction.OK)
		);
}

export function mapToDialogReturnData<T>() {
	return (source$: Observable<DialogReturn<T>>) => source$.pipe(map((result) => result.data));
}

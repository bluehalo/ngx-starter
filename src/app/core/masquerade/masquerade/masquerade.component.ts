import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, Subject, concat, of } from 'rxjs';
import {
	catchError,
	debounceTime,
	distinctUntilChanged,
	map,
	switchMap,
	tap
} from 'rxjs/operators';

import { LoadingSpinnerComponent } from '../../../common';
import { User } from '../../auth';
import { APP_SESSION } from '../../tokens';
import { MasqueradeService } from '../masquerade.service';

@Component({
	templateUrl: './masquerade.component.html',
	standalone: true,
	imports: [LoadingSpinnerComponent, FormsModule, NgSelectModule, AsyncPipe]
})
export class MasqueradeComponent implements OnInit {
	usersLoading = false;
	usersInput$ = new Subject<string>();
	users$: Observable<User[]>;

	selectedUserDn: string;

	isMasquerading = false;

	searchByDn = false;

	private masqueradeService = inject(MasqueradeService);
	#session = inject(APP_SESSION);

	ngOnInit() {
		if (this.masqueradeService.getMasqueradeDn()) {
			this.isMasquerading = true;
			this.masqueradeService.clear();
			window.location.href = '/api/auth/signout';
		} else if (this.#session().user?.canMasquerade) {
			this.loadUsers();
		} else {
			// window.location.href = '#/';
		}
	}

	submit() {
		this.masqueradeService.setMasqueradeDn(this.selectedUserDn);
		window.location.href = '/api/auth/signout';
	}

	private loadUsers() {
		this.users$ = concat(
			of([]), // default items
			this.usersInput$.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				tap(() => (this.usersLoading = true)),
				switchMap((term) => this.masqueradeService.searchUsers({}, term)),
				map((result) => result.elements),
				catchError(() => of([])), // empty list on error
				tap(() => {
					this.usersLoading = false;
				})
			)
		);
	}
}

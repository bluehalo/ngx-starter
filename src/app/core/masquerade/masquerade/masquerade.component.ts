import { AsyncPipe, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

import { LoadingSpinnerComponent } from '../../../common/loading-spinner/loading-spinner.component';
import { isNotNullOrUndefined } from '../../../common/rxjs-utils';
import { SessionService } from '../../auth/session.service';
import { User } from '../../auth/user.model';
import { MasqueradeService } from '../masquerade.service';

@Component({
	templateUrl: './masquerade.component.html',
	standalone: true,
	imports: [NgIf, LoadingSpinnerComponent, FormsModule, NgSelectModule, AsyncPipe]
})
export class MasqueradeComponent implements OnInit {
	usersLoading = false;
	usersInput$ = new Subject<string>();

	users$: Observable<User[]>;

	selectedUserDn: string;

	isMasquerading = false;

	searchByDn = false;

	private destroyRef = inject(DestroyRef);
	public router = inject(Router);
	private masqueradeService = inject(MasqueradeService);
	private sessionService = inject(SessionService);

	ngOnInit() {
		if (this.masqueradeService.getMasqueradeDn()) {
			this.isMasquerading = true;
			this.masqueradeService.clear();
			window.location.href = '/api/auth/signout';
		} else {
			this.sessionService
				.getSession()
				.pipe(isNotNullOrUndefined(), takeUntilDestroyed(this.destroyRef))
				.subscribe((session) => {
					if (session.user.canMasquerade) {
						this.loadUsers();
					} else {
						window.location.href = '#/';
					}
				});
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

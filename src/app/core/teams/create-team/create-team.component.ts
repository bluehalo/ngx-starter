import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, Subject, concat, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { MultiSelectDirective } from '../../../common/multi-select.directive';
import { PagingOptions } from '../../../common/paging.model';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { SessionService, User, UserExternalRolesSelectDirective } from '../../auth';
import { APP_CONFIG, APP_SESSION } from '../../tokens';
import { TeamSelectInputComponent } from '../team-select-input/team-select-input.component';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@Component({
	templateUrl: './create-team.component.html',
	standalone: true,
	imports: [
		RouterLink,
		SystemAlertComponent,
		FormsModule,
		NgSelectModule,
		TeamSelectInputComponent,
		AsyncPipe,
		MultiSelectDirective,
		UserExternalRolesSelectDirective
	]
})
export class CreateTeamComponent implements OnInit {
	team: Team = new Team();

	teamAdmin?: User;

	usersLoading = false;
	usersInput$ = new Subject<string>();
	users$: Observable<User[]> = of([]);

	isSubmitting = false;

	private pagingOptions: PagingOptions = new PagingOptions();

	private destroyRef = inject(DestroyRef);
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private teamsService = inject(TeamsService);
	private sessionService = inject(SessionService);
	private alertService = inject(SystemAlertService);
	private config = inject(APP_CONFIG);
	#session = inject(APP_SESSION);

	nestedTeamsEnabled = computed(() => this.config()?.teams?.nestedTeams ?? false);
	implicitMembersStrategy = computed(() => this.config()?.teams?.implicitMembers?.strategy);
	isAdmin = computed(() => this.#session().isAdmin());

	constructor() {
		this.alertService.clearAllAlerts();

		if (this.#session().isAdmin()) {
			this.setCurrentUserAsAdmin();
		}
	}

	ngOnInit() {
		this.route.queryParamMap
			.pipe(
				filter((params) => params.has('parent')),
				map((params) => params.get('parent')),
				filter((id: string | null): id is string => id !== null),
				switchMap((id) => this.teamsService.read(id)),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((parent) => {
				this.team.parent = parent ?? undefined;
			});

		if (this.isAdmin()) {
			this.users$ = concat(
				of([]), // default items
				this.usersInput$.pipe(
					debounceTime(200),
					distinctUntilChanged(),
					tap(() => (this.usersLoading = true)),
					switchMap((term) =>
						this.teamsService.searchUsers({}, term, this.pagingOptions, {}, true)
					),
					map((result) =>
						result.elements.filter((user: any) => user?._id !== this.teamAdmin?._id)
					),
					tap(() => {
						this.usersLoading = false;
					})
				)
			);
		}
		this.team.implicitMembers = false;
	}

	setCurrentUserAsAdmin() {
		this.teamAdmin = this.#session().user;
	}

	save() {
		this.isSubmitting = true;
		this.teamsService
			.create(this.team, this?.teamAdmin?._id)
			.pipe(
				switchMap(() => this.sessionService.reloadSession()),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => {
				return this.router.navigate(['/team']);
			});
	}
}

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
import { AuthorizationService } from '../../auth/authorization.service';
import { UserExternalRolesSelectDirective } from '../../auth/directives/user-external-roles-select.directive';
import { SessionService } from '../../auth/session.service';
import { User } from '../../auth/user.model';
import { APP_CONFIG } from '../../config.service';
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

	isAdmin = false;

	teamAdmin: User | null = null;

	usersLoading = false;
	usersInput$ = new Subject<string>();
	users$: Observable<User[]> = of([]);

	isSubmitting = false;

	private user: User | null = null;

	private pagingOptions: PagingOptions = new PagingOptions();

	private destroyRef = inject(DestroyRef);
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private teamsService = inject(TeamsService);
	private sessionService = inject(SessionService);
	private authorizationService = inject(AuthorizationService);
	private alertService = inject(SystemAlertService);
	private config = inject(APP_CONFIG);

	nestedTeamsEnabled = computed(() => this.config()?.teams?.nestedTeams ?? false);
	implicitMembersStrategy = computed(() => this.config()?.teams?.implicitMembers?.strategy);

	ngOnInit() {
		this.alertService.clearAllAlerts();

		this.sessionService
			.getSession()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((session) => {
				this.user = session?.user ?? null;
				this.isAdmin = this.authorizationService.isAdmin();
				if (!this.isAdmin) {
					this.setCurrentUserAsAdmin();
				}
			});

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

		if (this.isAdmin) {
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
		this.teamAdmin = this.user;
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

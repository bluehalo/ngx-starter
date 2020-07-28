import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { concat, of, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, map, switchMap, tap } from 'rxjs/operators';

import { PagingOptions } from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert.module';
import { AuthenticationService } from '../../auth/authentication.service';
import { AuthorizationService } from '../../auth/authorization.service';
import { SessionService } from '../../auth/session.service';
import { User } from '../../auth/user.model';
import { Config } from '../../config.model';
import { ConfigService } from '../../config.service';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@UntilDestroy()
@Component({
	templateUrl: './create-team.component.html'
})
export class CreateTeamComponent implements OnInit {
	team: Team = new Team();

	implicitMembersStrategy: string = null;

	isAdmin = false;

	teamAdmin: User;

	usersLoading = false;
	usersInput$ = new Subject<string>();
	users$: Observable<User[]>;

	isSubmitting = false;

	private user: User;

	private pagingOptions: PagingOptions = new PagingOptions();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private configService: ConfigService,
		private teamsService: TeamsService,
		private sessionService: SessionService,
		private authenticationService: AuthenticationService,
		private authorizationService: AuthorizationService,
		private alertService: SystemAlertService
	) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();

		this.configService
			.getConfig()
			.pipe(first(), untilDestroyed(this))
			.subscribe((config: Config) => {
				this.implicitMembersStrategy = config?.teams?.implicitMembers?.strategy;
			});

		this.sessionService
			.getSession()
			.pipe(untilDestroyed(this))
			.subscribe(session => {
				this.user = session.user;
				this.isAdmin = this.authorizationService.isAdmin();
				if (!this.isAdmin) {
					this.setCurrentUserAsAdmin();
				}
			});

		if (this.isAdmin) {
			this.users$ = concat(
				of([]), // default items
				this.usersInput$.pipe(
					debounceTime(200),
					distinctUntilChanged(),
					tap(() => (this.usersLoading = true)),
					switchMap(term =>
						this.teamsService.searchUsers({}, term, this.pagingOptions, {}, true)
					),
					map(result =>
						result.elements.filter(
							(user: any) => user?.userModel._id !== this.teamAdmin?.userModel._id
						)
					),
					tap(() => {
						this.usersLoading = false;
					})
				)
			);
		}
	}

	setCurrentUserAsAdmin() {
		this.teamAdmin = this.user;
	}

	save() {
		this.isSubmitting = true;
		this.teamsService
			.create(this.team, this.teamAdmin.userModel._id)
			.pipe(
				tap(() => this.authenticationService.reloadCurrentUser()),
				untilDestroyed(this)
			)
			.subscribe(() => {
				return this.router.navigate(['/teams', { clearCachedFilter: true }]);
			});
	}
}

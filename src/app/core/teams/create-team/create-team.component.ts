import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { TypeaheadMatch } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';

import { PagingResults, PagingOptions } from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert.module';

import { User } from '../../auth/user.model';
import { AuthenticationService } from '../../auth/authentication.service';
import { ConfigService } from '../../config.service';

import { SessionService } from '../../auth/session.service';
import { AuthorizationService } from '../../auth/authorization.service';
import { AdminUsersService } from '../../admin/user-management/admin-users.service';

import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@Component({
	templateUrl: './create-team.component.html',
	styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent implements OnInit {

	team: Team = new Team();

	showExternalTeams: boolean = false;

	isAdmin: boolean = false;

	defaultTeamAdmin: any;

	editDefaultTeamAdmin: boolean = false;

	queryUserSearchTerm: string = '';

	searchUsersRef: Observable<any>;

	submitting: boolean = false;

	private user: User;

	private pagingOptions: PagingOptions = new PagingOptions();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private configService: ConfigService,
		private teamsService: TeamsService,
		private userService: AdminUsersService,
		private sessionService: SessionService,
		private authenticationService: AuthenticationService,
		private authorizationService: AuthorizationService,
		private alertService: SystemAlertService,
	) {
	}

	ngOnInit() {
		this.alertService.clearAllAlerts();

		this.configService.getConfig()
			.pipe(first())
			.subscribe((config: any) => {
				// Need to show external groups when in proxy-pki mode
				if (config.auth === 'proxy-pki') {
					this.showExternalTeams = this.isAdmin;
				}
			});

		this.sessionService.getSession()
			.subscribe((session) => {
				this.user = session.user;
				this.isAdmin = this.authorizationService.isAdmin();
				this.defaultTeamAdmin = this.user.userModel;
			});

		// Bind the search users typeahead to a function
		if (this.isAdmin) {
			this.searchUsersRef = Observable.create((observer: any) => {
				this.userService.search({}, this.queryUserSearchTerm, this.pagingOptions, {})
					.subscribe((result: PagingResults) => {
						let formatted = result.elements
							.filter((user: any) => user._id !== this.defaultTeamAdmin._id)
							.map((user: any) => user.userModel)
							.map((user: any) => {
								user.displayName = `${user.name} (${user.username})`;
								return user;
							});
						observer.next(formatted);
					});
			});
		}
	}

	typeaheadOnSelect(selected: TypeaheadMatch) {
		this.defaultTeamAdmin = selected.item;
		this.queryUserSearchTerm = '';
		this.editDefaultTeamAdmin = false;
	}

	save() {
		this.submitting = true;
		this.teamsService
			.create(this.team, (this.defaultTeamAdmin._id !== this.user.userModel._id) ? this.defaultTeamAdmin._id : null)
			.pipe(
				tap(() => this.authenticationService.reloadCurrentUser())
			)
			.subscribe(() => {
				return this.router.navigate(['/teams', {clearCachedFilter: true}]);
			}, (error: HttpErrorResponse) => {
				this.submitting = false;
				this.alertService.addClientErrorAlert(error);
			});
	}

}

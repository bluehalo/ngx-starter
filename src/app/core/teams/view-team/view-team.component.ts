import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import cloneDeep from 'lodash/cloneDeep';

import { of } from 'rxjs';
import { catchError, filter, first, map, switchMap, tap } from 'rxjs/operators';

import { Team } from '../team.model';
import { ModalAction, ModalService } from '../../../common/modal.module';
import { SystemAlertService } from '../../../common/system-alert.module';

import { AuthenticationService } from '../../auth/authentication.service';
import { AuthorizationService } from '../../auth/authorization.service';
import { TeamsService } from '../teams.service';
import { TeamAuthorizationService } from '../team-authorization.service';

@Component({
	selector: 'app-view-team',
	templateUrl: './view-team.component.html',
	styleUrls: ['./view-team.component.scss']
})
export class ViewTeamComponent implements OnInit {

	team: Team;
	_team: any;

	canManageTeam = false;

	isEditing = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private modalService: ModalService,
		private teamsService: TeamsService,
		private alertService: SystemAlertService,
		private authenticationService: AuthenticationService,
		private authorizationService: AuthorizationService,
		private teamAuthorizationService: TeamAuthorizationService
	) {
	}

	ngOnInit() {
		this.route.data.pipe(
			map((data) => data.team)
		).subscribe((team) => {
			this.updateTeam(team);
		});
	}

	edit() {
		this._team = cloneDeep(this.team);
		this.isEditing = true;
	}

	cancelEdit() {
		this.isEditing = false;
	}

	saveEdit() {
		this.teamsService.update(this.team._id, this._team)
			.pipe(
				tap(() => this.authenticationService.reloadCurrentUser())
			)
			.subscribe((team: Team) => {
				this.isEditing = false;
				this.team = team;
				this.alertService.addAlert('Updated team metadata', 'success', 5000);
			});
	}

	updateTeam(team: any) {
		if (null != team) {
			this.team = team;
			this.canManageTeam = this.authorizationService.isAdmin() || this.teamAuthorizationService.isAdmin(team);
		} else {
			this.router.navigate(['resource/invalid', {type: 'team'}]);
		}
	}

	remove() {
		this.modalService
			.confirm(
				'Delete team?',
				`Are you sure you want to delete the team: <strong>"${this.team.name}"</strong>?<br/>This action cannot be undone.`,
				'Delete'
			).pipe(
				first(),
				filter((action: ModalAction) => action === ModalAction.OK),
				switchMap(() => this.teamsService.delete(this.team._id)),
				tap(() => this.authenticationService.reloadCurrentUser()),
				catchError((error: HttpErrorResponse) => {
					this.alertService.addClientErrorAlert(error);
					return of(null);
				})
			).subscribe(() => this.router.navigate(['/teams', {clearCachedFilter: true}]));
	}

}

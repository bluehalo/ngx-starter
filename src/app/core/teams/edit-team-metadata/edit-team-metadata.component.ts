import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { first, tap } from 'rxjs/operators';

import { SystemAlertService } from '../../../common/system-alert.module';

import { AuthorizationService } from '../../auth/authorization.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { ConfigService } from '../../config.service';

import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@Component({
	selector: 'edit-team-metadata',
	templateUrl: './edit-team-metadata.component.html',
	styleUrls: ['./edit-team-metadata.component.scss']
})
export class EditTeamMetadataComponent implements OnInit {

	@Output() metadataUpdated: EventEmitter<any> = new EventEmitter();

	@Input('team')
	set _team(t: Team) {
		this.team = cloneDeep(t);
	}

	team: Team;

	showExternalTeams = false;

	constructor(
		private configService: ConfigService,
		private teamsService: TeamsService,
		private alertService: SystemAlertService,
		private authenticationService: AuthenticationService,
		private authorizationService: AuthorizationService,
	) {
	}

	ngOnInit() {
		this.configService.getConfig()
			.pipe(first())
			.subscribe((config: any) => {
				// Need to show external groups when in proxy-pki mode
				if (config.auth === 'proxy-pki') {
					this.showExternalTeams = this.authorizationService.isAdmin();
				}
			});
	}

	save() {
		this.teamsService.update(this.team)
			.pipe(
				tap(() => this.authenticationService.reloadCurrentUser())
			)
			.subscribe((team: any) => {
				this.alertService.addAlert('Updated team metadata', 'success');
				this.metadataUpdated.emit(team);
			});
	}

}

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Team } from './team.model';
import { TeamsService } from './teams.service';

@Injectable()
export class TeamsResolve implements Resolve<Team> {

	constructor(
		private teamsService: TeamsService
	) {}

	resolve(route: ActivatedRouteSnapshot) {
		return this.teamsService.get(route.paramMap.get('id'));
	}
}

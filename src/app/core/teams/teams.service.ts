import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import isArray from 'lodash/isArray';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { PagingOptions, PagingResults, NULL_PAGING_RESULTS } from '../../common/paging.module';
import { SystemAlertService } from '../../common/system-alert.module';

import { AuthorizationService } from '../auth/authorization.service';
import { SessionService } from '../auth/session.service';

import { Team } from './team.model';
import { TeamMember } from './team-member.model';
import { TeamAuthorizationService } from './team-authorization.service';
import { User } from '../auth/user.model';

export interface AddedMember {
	username?: string;
	role: string;
	roleDisplay: string;
}

@Injectable()
export class TeamsService {

	headers: any = { 'Content-Type': 'application/json' };

	constructor(
		private http: HttpClient,
		private sessionService: SessionService,
		private alertService: SystemAlertService,
		private authorizationService: AuthorizationService,
		private teamAuthorizationService: TeamAuthorizationService) {
	}

	// create(team: Team, firstAdmin?: any): Observable<any> {
	// 	return this.asyHttp.put(new HttpOptions('team', () => { }, { team, firstAdmin }));
	// }

	create(team: Team, firstAdmin?: any): Observable<any> {
		return this.http.put(
			`api/team`,
			JSON.stringify(team),
			{ headers: this.headers }
		).pipe(
			catchError((error: HttpErrorResponse) => {
				this.alertService.addClientErrorAlert(error);
				return of(null);
			})
		);
	}

	get(teamId: string): Observable<Team> {
		return this.http.get(`api/team/${teamId}`).pipe(
			map((result: any) => (null != result) ? new Team(result._id, result.name, result.description, result.created, result.requiresExternalTeams) : null),
			catchError((error: HttpErrorResponse) => {
				this.alertService.addClientErrorAlert(error);
				return of(null);
			})
		);
	}

	update(team: Team): Observable<Team> {
		return this.http.post(
			`api/team/${team._id}`,
			JSON.stringify(team),
			{ headers: this.headers }
		).pipe(
			map((result: any) => (null != result) ? new Team(result._id, result.name, result.description, result.created, result.requiresExternalTeams) : null),
			catchError((error: HttpErrorResponse) => {
				this.alertService.addClientErrorAlert(error);
				return of(null);
			})
		);
	}

	search(paging: PagingOptions, query: any, search: string = null, options: any): Observable<PagingResults> {
		return this.http.post(
			'api/teams',
			JSON.stringify({s: search, q: query, options}),
			{ params: paging.toObj(), headers: this.headers }
		).pipe(
			map((result: PagingResults) => {
				if (null != result && Array.isArray(result.elements)) {
					result.elements = result.elements.map((element: any) => new Team(element._id, element.name, element.description, element.created).setFromModel(element));
				}
				return result;
			}),
			catchError(() => {
				return of(NULL_PAGING_RESULTS);
			})
		);
	}

	delete(teamId: string): Observable<any> {
		return this.http.delete(`api/team/${teamId}`);
	}

	addMember(teamId: string, memberId: string, role?: string): Observable<any> {
		return this.http.post(
			`api/team/${teamId}/member/${memberId}`,
			JSON.stringify({ role: role }),
			{ headers: this.headers }
		);
	}

	addMembers(newMembers: AddedMember[], teamId: string): Observable<any> {
		return this.http.put(
			`api/team/${teamId}/members`,
			JSON.stringify({ newMembers: newMembers }),
			{ headers: this.headers }
		);
	}

	searchMembers(teamId: string, team: Team, query: any, search: any, paging: PagingOptions, options: any): Observable<PagingResults> {
		return this.http.post(
			`api/team/${teamId}/members?`,
			JSON.stringify({s: search, q: query, options}),
			{ params: paging.toObj(), headers: this.headers }
		).pipe(
			map((result: PagingResults) => this.handleTeamMembers(result, team)),
			catchError(() => of(NULL_PAGING_RESULTS))
		);
	}

	removeMember(teamId: string, memberId: string): Observable<any> {
		return this.http.delete(`api/team/${teamId}/member/${memberId}`);
	}

	updateMemberRole(teamId: string, memberId: string, role: string): Observable<any> {
		return this.http.post(
			`api/team/${teamId}/member/${memberId}/role`,
			JSON.stringify( { role: role }),
			{ headers: this.headers }
		);
	}

	getTeams(): Observable<Team[]> {
		return this.search(new PagingOptions(0, 1000), {}, null, {}).pipe(
			map((results: PagingResults) => {
				return results.elements;
			}),
			catchError(() => of([]))
		);
	}

	getTeamsCanManageResources(): Observable<Team[]> {
		return this.getTeams().pipe(
			map((teams: Team[]) => {
				return teams.filter((team) => {
					return this.authorizationService.isAdmin()
						|| this.teamAuthorizationService.canManageResources(team);
				});
			})
		);
	}

	searchUsers(query: any, search: string, paging: PagingOptions, options: any): Observable<PagingResults> {
		return this.http.post(
			'api/users',
			{ q: query, s: search, options: options },
			{ params: paging.toObj() }
		).pipe(
			map((results: PagingResults) => {
				if (null != results && isArray(results.elements)) {
					results.elements = results.elements.map((element: any) => new User().setFromUserModel(element));
				}
				return results;
			})
		);
	}

	private handleTeamMembers(result: any, team: Team) {
		if (null != result && Array.isArray(result.elements)) {
			result.elements = result.elements.map((element: any) => new TeamMember().setFromTeamMemberModel(team, element));
		}
		return result;
	}
}

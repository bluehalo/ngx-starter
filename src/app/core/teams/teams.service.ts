import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AbstractEntityService, ServiceMethod } from '../../common/abstract-entity.service';
import { NULL_PAGING_RESULTS, PagingOptions, PagingResults } from '../../common/paging.model';
import { AuthorizationService } from '../auth/authorization.service';
import { SessionService } from '../auth/session.service';
import { User } from '../auth/user.model';
import { TeamAuthorizationService } from './team-authorization.service';
import { TeamMember } from './team-member.model';
import { Team } from './team.model';

export interface AddedMember {
	_id: string;
	username?: string;
	role: string;
	roleDisplay: string;
}

@Injectable()
export class TeamsService extends AbstractEntityService<Team> {
	constructor(
		private sessionService: SessionService,
		private authorizationService: AuthorizationService,
		private teamAuthorizationService: TeamAuthorizationService
	) {
		super({
			[ServiceMethod.create]: 'api/team',
			[ServiceMethod.read]: 'api/team',
			[ServiceMethod.update]: 'api/team',
			[ServiceMethod.delete]: 'api/team',
			[ServiceMethod.search]: 'api/teams'
		});
	}

	mapToType(model: any): Team {
		return new Team().setFromModel(model);
	}

	override create(team: Team, firstAdmin?: string): Observable<any> {
		return this.http
			.post(
				this.getMethodUrl(ServiceMethod.create),
				{
					team,
					firstAdmin: firstAdmin ?? null
				},
				{ headers: this.headers }
			)
			.pipe(
				map((model) => this.mapToType(model)),
				catchError((error: unknown) => this.handleError(error, null))
			);
	}

	addMember(team: Pick<Team, '_id'>, memberId: string, role?: string): Observable<any> {
		return this.http.post(
			`api/team/${team._id}/member/${memberId}`,
			{ role },
			{
				headers: this.headers
			}
		);
	}

	addMembers(newMembers: AddedMember[], team: Pick<Team, '_id'>): Observable<any> {
		return this.http.put(
			`api/team/${team._id}/members`,
			{ newMembers },
			{
				headers: this.headers
			}
		);
	}

	searchMembers(
		team: Team,
		query: any,
		search: any,
		paging: PagingOptions,
		options: any
	): Observable<PagingResults<TeamMember>> {
		return this.http
			.post<PagingResults>(
				`api/team/${team._id}/members?`,
				{ s: search, q: query, options },
				{ params: paging.toObj(), headers: this.headers }
			)
			.pipe(
				map((result: PagingResults) => this.handleTeamMembers(result, team)),
				catchError(() => of(NULL_PAGING_RESULTS))
			);
	}

	removeMember(team: Pick<Team, '_id'>, memberId: string): Observable<any> {
		return this.http.delete(`api/team/${team._id}/member/${memberId}`);
	}

	updateMemberRole(team: Pick<Team, '_id'>, memberId: string, role: string): Observable<any> {
		return this.http.post(
			`api/team/${team._id}/member/${memberId}/role`,
			{ role },
			{ headers: this.headers }
		);
	}

	getTeams(): Observable<Team[]> {
		return this.search(new PagingOptions(0, 1000, 0, 0, 'name', 'ASC')).pipe(
			map((results) => results.elements),
			catchError(() => of([]))
		);
	}

	getTeamsCanManageResources(): Observable<Team[]> {
		return this.getTeams().pipe(
			map((teams) =>
				teams.filter(
					(team) =>
						this.authorizationService.isAdmin() ||
						this.teamAuthorizationService.canManageResources(team)
				)
			)
		);
	}

	searchUsers(
		query: any,
		search: string,
		paging: PagingOptions,
		options: any,
		admin = false
	): Observable<PagingResults<User>> {
		const url = admin ? 'api/admin/users' : 'api/users';
		return this.http
			.post<PagingResults>(url, { q: query, s: search, options }, { params: paging.toObj() })
			.pipe(
				tap((results: PagingResults) => {
					if (null != results && Array.isArray(results.elements)) {
						results.elements = results.elements.map((element: any) =>
							new User().setFromUserModel(element)
						);
					}
				}),
				catchError((error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.alertService.addClientErrorAlert(error);
					}
					return of(NULL_PAGING_RESULTS);
				})
			);
	}

	private handleTeamMembers(result: any, team: Team): PagingResults<TeamMember> {
		if (null != result && Array.isArray(result.elements)) {
			result.elements = result.elements.map((element: any) =>
				new TeamMember().setFromTeamMemberModel(team, element)
			);
		}
		return result;
	}
}

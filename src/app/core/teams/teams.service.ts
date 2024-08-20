import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
	AbstractEntityService,
	NULL_PAGING_RESULTS,
	PagingOptions,
	PagingResults,
	ServiceMethod
} from '../../common';
import { User } from '../auth';
import { APP_SESSION } from '../tokens';
import { TeamMember } from './team-member.model';
import { TeamRole } from './team-role.model';
import { Team } from './team.model';

export interface AddedMember {
	_id: string;
	name?: string;
	username?: string;
	role: string;
	roleDisplay: string;
}

export const teamResolver: ResolveFn<Team | null> = (
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot,
	router = inject(Router),
	service = inject(TeamsService)
) => {
	const id = route.paramMap.get('id') ?? 'undefined';
	return service.read(id).pipe(catchError((error: unknown) => service.redirectError(error)));
};

@Injectable({
	providedIn: 'root'
})
export class TeamsService extends AbstractEntityService<Team> {
	#session = inject(APP_SESSION);

	constructor() {
		super({
			[ServiceMethod.create]: 'api/team',
			[ServiceMethod.read]: 'api/team',
			[ServiceMethod.update]: 'api/team',
			[ServiceMethod.delete]: 'api/team',
			[ServiceMethod.search]: 'api/teams'
		});
	}

	mapToType(model: unknown): Team {
		return new Team(model);
	}

	override create(team: Team, firstAdmin?: string): Observable<Team | null> {
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

	addMember(team: Pick<Team, '_id'>, memberId: string, role?: string): Observable<unknown> {
		return this.http.post(
			`api/team/${team._id}/member/${memberId}`,
			{ role },
			{
				headers: this.headers
			}
		);
	}

	addMembers(newMembers: AddedMember[], team: Pick<Team, '_id'>): Observable<unknown> {
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
		paging: PagingOptions,
		query: object = {},
		search = '',
		body?: object,
		options: object = {}
	): Observable<PagingResults<TeamMember>> {
		return this.http
			.post<PagingResults>(
				`api/team/${team._id}/members`,
				{ s: search, q: query, options, ...body },
				{ params: paging.toObj(), headers: this.headers }
			)
			.pipe(
				map((pagingResults) => {
					return {
						...pagingResults,
						elements: pagingResults.elements.map((model) => new TeamMember(model, team))
					} as PagingResults<TeamMember>;
				}),
				catchError(() => of(NULL_PAGING_RESULTS as PagingResults<TeamMember>))
			);
	}

	removeMember(team: Pick<Team, '_id'>, memberId: string): Observable<unknown> {
		return this.http.delete(`api/team/${team._id}/member/${memberId}`);
	}

	updateMemberRole(team: Pick<Team, '_id'>, memberId: string, role: string): Observable<unknown> {
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
						this.#session().isAdmin() ||
						this.#session().hasSomeTeamRoles(team, [TeamRole.EDITOR, TeamRole.ADMIN])
				)
			)
		);
	}

	searchUsers(
		paging: PagingOptions,
		query: object = {},
		search = '',
		body?: object,
		options: object = {},
		admin = false
	): Observable<PagingResults<User>> {
		const url = admin ? 'api/admin/users' : 'api/users';
		return this.http
			.post<PagingResults>(
				url,
				{ q: query, s: search, options, ...body },
				{ params: paging.toObj() }
			)
			.pipe(
				map((pagingResults) => {
					return {
						...pagingResults,
						elements: pagingResults.elements.map((model) => new User(model))
					} as PagingResults<User>;
				}),
				catchError((error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.alertService.addClientErrorAlert(error);
					}
					return of(NULL_PAGING_RESULTS as PagingResults<User>);
				})
			);
	}
}

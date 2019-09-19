import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import isEmpty from 'lodash/isEmpty';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { BehaviorSubject, Subject, combineLatest, of, Observable } from 'rxjs';
import { catchError, debounceTime, filter, first, map, switchMap, tap } from 'rxjs/operators';

import { ModalAction, ModalService } from '../../../common/modal.module';
import { PagingOptions, PagingResults, SortableTableHeader, SortDirection } from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert.module';

import { AuthenticationService } from '../../auth/authentication.service';
import { AuthorizationService } from '../../auth/authorization.service';

import { TeamRole } from '../team-role.model';
import { TeamMember } from '../team-member.model';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';
import { AddMembersModalComponent } from '../add-members-modal/add-members-modal.component';
import { TeamAuthorizationService } from '../team-authorization.service';
import { SessionService } from '../../auth/session.service';
import { User } from '../../auth/user.model';

@Component({
	selector: 'list-team-members',
	templateUrl: './list-team-members.component.html',
	styleUrls: ['./list-team-members.component.scss']
})
export class ListTeamMembersComponent implements OnInit {

	@Input('team')
	team: Team;

	isUserAdmin: boolean;

	teamMembers: TeamMember[];

	canManageTeam: boolean = false;

	search: string = '';

	hasSearch: boolean;

	teamRoleOptions: any[] = TeamRole.ROLES;

	user: User;

	headers: SortableTableHeader[] = [
		{
			name: 'Name',
			sortField: 'name',
			sortDir: SortDirection.asc,
			sortable: true,
			tooltip: 'Sort by Name',
			default: true
		},
		{
			name: 'Username',
			sortField: 'username',
			sortDir: SortDirection.asc,
			sortable: true,
			tooltip: 'Sort by Username'
		},
		{name: 'Account Status', sortable: false},
		{name: 'Bypassed', sortField: 'bypassed', sortable: false},
		{name: 'Role', sortable: false},
		{name: '', sortField: 'remove', sortable: false},
	];

	headersToShow: SortableTableHeader[] = [];

	pagingOptions: PagingOptions = new PagingOptions();

	pageSize: number = 20;

	pageEvent$: BehaviorSubject<PagingOptions> = new BehaviorSubject(new PagingOptions(0, this.pageSize));

	sortEvent$: BehaviorSubject<SortableTableHeader> = new BehaviorSubject(this.headers.find((header: any) => header.default));

	searchEvent$: BehaviorSubject<string> = new BehaviorSubject<string>(this.search);

	private load$: BehaviorSubject<boolean> = new BehaviorSubject(true);

	private resetPaging: boolean = false;

	private modalRef: BsModalRef;

	constructor(
		private bsModalService: BsModalService,
		private modalService: ModalService,
		private router: Router,
		private teamsService: TeamsService,
		private authenticationService: AuthenticationService,
		private authorizationService: AuthorizationService,
		private teamAuthorizationService: TeamAuthorizationService,
		private sessionService: SessionService,
		private alertService: SystemAlertService
	) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();

		this.canManageTeam = this.authorizationService.isAdmin() || this.teamAuthorizationService.isAdmin(this.team);

		this.sessionService.getSession()
			.subscribe((session) => {
				this.user = session.user;
				this.isUserAdmin = this.authorizationService.isAdmin();
			});

		const defaultSort = this.headers.find((header: any) => header.default);
		if (null != defaultSort) {
			this.pagingOptions.sortField = defaultSort.sortField;
			this.pagingOptions.sortDir = defaultSort.sortDir;
		}

		const paging$ = combineLatest(this.pageEvent$, this.sortEvent$)
			.pipe(
				map(([paging, sort]: [PagingOptions, SortableTableHeader]) => {
					paging.sortField = sort.sortField;
					paging.sortDir = sort.sortDir;
					return paging;
				}),
				tap((paging: PagingOptions) => {
					this.pagingOptions = new PagingOptions(paging.pageNumber, this.pageSize, 0, 0, paging.sortField, paging.sortDir);
				})
			);

		const search$ = this.searchEvent$
			.pipe(
				tap((search: string) => {
					this.resetPaging = true;
					this.search = search;
				})
			);

		combineLatest(this.load$, paging$, search$)
			.pipe(
				map(([, paging, ]: [boolean, PagingOptions, string]) => {
					if (this.resetPaging) {
						paging = new PagingOptions(0, this.pageSize, 0, 0, paging.sortField, paging.sortDir);
					}
					return paging;
				}),
				debounceTime(100),
				switchMap((pagingOpt: PagingOptions) => {
					this.hasSearch = !isEmpty(this.search);
					return this.teamsService.searchMembers(this.team._id, this.team, null, this.search, pagingOpt, {});
				})
			).subscribe((result: PagingResults) => {
			this.teamMembers = result.elements;
			if (this.teamMembers.length > 0) {
				this.pagingOptions.set(result.pageNumber, result.pageSize, result.totalPages, result.totalSize);
			}
			else {
				this.pagingOptions.reset();
			}
			this.resetPaging = false;
		});

		this.headersToShow = (this.canManageTeam) ? this.headers.filter((header: SortableTableHeader) => header.sortField !== 'remove') : this.headers;
		this.headersToShow = (this.isUserAdmin) ? this.headers : this.headers.filter((header: SortableTableHeader) => header.sortField !== 'bypassed');
	}

	addMembers() {
		this.modalRef = this.bsModalService.show(AddMembersModalComponent);
		this.modalRef.content.teamId = this.team._id;
		this.modalRef.content.usersAdded
			.subscribe((usersAdded: number) => {
				this.alertService.addAlert(`${usersAdded} user(s) added`, 'success');
				this.modalRef = null;
				this.reloadTeamMembers();
			});
	}

	removeMember(member: TeamMember) {
		this.modalService
			.confirm(
				'Remove member from team?',
				`Are you sure you want to remove member: "${member.userModel.name}" from this team?`,
				'Remove Member')
			.pipe(
				first(),
				filter((action: ModalAction) => action === ModalAction.OK),
				switchMap(() => this.teamsService.removeMember(this.team._id, member.userModel._id)),
				tap(() => this.authenticationService.reloadCurrentUser()),
				catchError((error: HttpErrorResponse) => {
					this.alertService.addClientErrorAlert(error);
					return of(null);
				})
			)
			.subscribe(() => this.reloadTeamMembers());
	}

	updateRole(member: TeamMember, role: string) {
		// No update required
		if (member.role === role) {
			return;
		}

		// If user is removing their own admin, verify that they know what they're doing
		if (this.user.userModel._id === member.userModel._id && member.role === 'admin' && role !== 'admin') {
			this.modalService
				.confirm(
					'Remove "Team Admin" role?',
					`Are you sure you want to remove <strong>yourself</strong> from the Team Admin role?<br/>Once you do this, you will no longer be able to manage the members of this team. <br/><strong>This also means you won\'t be able to give the role back to yourself.</strong>`,
					'Remove Admin'
				).pipe(
					first(),
					filter((action: ModalAction) => action === ModalAction.OK),
					switchMap(() => this.doUpdateRole(member, role)),
					tap(() => this.authenticationService.reloadCurrentUser()),
					catchError((error: HttpErrorResponse) => {
						this.alertService.addClientErrorAlert(error);
						return of(null);
					})
				).subscribe(() => {
					// If we successfully removed the role from ourselves, redirect away
					this.router.navigate(['/teams', {clearCachedFilter: true}]);
				});
		}
		else if (!member.explicit) {
			// Member is implicitly in team, should explicitly add this member with the desired role
			this.addMember(member, role);
		}
		else {
			this.doUpdateRole(member, role)
				.pipe(
					catchError((error: HttpErrorResponse) => {
						this.alertService.addClientErrorAlert(error);
						return of(null);
					})
				).subscribe(() => this.reloadTeamMembers());
		}
	}

	private addMember(member: TeamMember, role?: string) {
		if (null == this.team._id || null == member) {
			this.alertService.addAlert('Failed to add member. Missing member or teamId.');
			return;
		}

		this.teamsService.addMember(this.team._id, member.userModel._id, role)
			.pipe(
				tap(() => this.authenticationService.reloadCurrentUser()),
				catchError((error: HttpErrorResponse) => {
					this.alertService.addClientErrorAlert(error);
					return of(null);
				})
			).subscribe(() => this.reloadTeamMembers());
	}

	private doUpdateRole(member: TeamMember, role: string, persist: boolean = true): Observable<any> {
		if (!persist) {
			member.role = role;
			member.roleDisplay = TeamRole.getDisplay(member.role);
			return of(member);
		}

		return this.teamsService.updateMemberRole(this.team._id, member.userModel._id, role);
	}

	private reloadTeamMembers() {
		this.resetPaging = true;
		this.pageEvent$.next(this.pagingOptions);
	}
}

import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
	Component,
	DestroyRef,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges,
	ViewChild,
	inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable, of } from 'rxjs';
import { catchError, filter, first, switchMap } from 'rxjs/operators';

import {
	DialogAction,
	DialogService,
	isDialogActionOK,
	mapToDialogReturnData
} from '../../../common/dialog';
import { PagingOptions, PagingResults } from '../../../common/paging.model';
import { AgoDatePipe } from '../../../common/pipes/ago-date.pipe';
import { UtcDatePipe } from '../../../common/pipes/utc-date-pipe/utc-date.pipe';
import { isNotNullOrUndefined } from '../../../common/rxjs-utils';
import { SearchInputComponent } from '../../../common/search-input/search-input.component';
import { SortDirection } from '../../../common/sorting.model';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import {
	AgoDateColumnComponent,
	AsyFilterDirective,
	AsyHeaderListFilterComponent,
	AsySortDirective,
	AsySortHeaderComponent,
	AsyTableDataSource,
	AsyTableEmptyStateComponent,
	ListFilterOption,
	PaginatorComponent,
	TextColumnComponent
} from '../../../common/table';
import { AuthorizationService } from '../../auth/authorization.service';
import { SessionService } from '../../auth/session.service';
import { User } from '../../auth/user.model';
import {
	AddMembersModalComponent,
	AddMembersModalData,
	AddMembersModalReturn
} from '../add-members-modal/add-members-modal.component';
import { HasTeamRoleDirective } from '../directives/has-team-role.directive';
import { TeamMember } from '../team-member.model';
import { TeamRole } from '../team-role.model';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@Component({
	selector: 'list-team-members',
	templateUrl: './list-team-members.component.html',
	standalone: true,
	imports: [
		SearchInputComponent,
		NgIf,
		HasTeamRoleDirective,
		CdkTableModule,
		AsySortDirective,
		AsyFilterDirective,
		AsySortHeaderComponent,
		TooltipModule,
		AsyHeaderListFilterComponent,
		NgFor,
		AsyTableEmptyStateComponent,
		PaginatorComponent,
		AgoDatePipe,
		UtcDatePipe,
		CdkMenu,
		CdkMenuTrigger,
		CdkMenuItem,
		TextColumnComponent,
		AgoDateColumnComponent
	]
})
export class ListTeamMembersComponent implements OnChanges, OnDestroy, OnInit {
	@ViewChild(AsyFilterDirective)
	filter: AsyFilterDirective;

	@Input({ required: true })
	team!: Team;

	isUserAdmin = false;

	teamRoleOptions: any[] = TeamRole.ROLES;

	typeFilterOptions: ListFilterOption[] = [
		{ display: 'Explicit', value: 'explicit', active: false, hide: false },
		{ display: 'Implicit', value: 'implicit', active: false, hide: false }
	];
	roleFilterOptions = TeamRole.ROLES.map(
		(role) =>
			({
				display: role.label,
				value: role.role
			}) as ListFilterOption
	);

	user: User | null = null;

	columns = ['name', 'username', 'lastLogin', 'type', 'role', 'actions'];
	displayedColumns: string[] = [];

	dataSource = new AsyTableDataSource<TeamMember>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		undefined,
		{
			sortField: 'name',
			sortDir: SortDirection.asc
		}
	);

	private destroyRef = inject(DestroyRef);
	private dialogService = inject(DialogService);
	private router = inject(Router);
	private teamsService = inject(TeamsService);
	private authorizationService = inject(AuthorizationService);
	private sessionService = inject(SessionService);
	private alertService = inject(SystemAlertService);

	ngOnInit() {
		this.alertService.clearAllAlerts();

		this.sessionService
			.getSession()
			.pipe(isNotNullOrUndefined(), takeUntilDestroyed(this.destroyRef))
			.subscribe((session) => {
				this.user = session?.user ?? null;
				this.isUserAdmin = this.authorizationService.isAdmin();
			});

		this.displayedColumns = this.columns.filter(
			(column) => this.team.implicitMembers || column !== 'explicit'
		);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['team']) {
			this.dataSource.reload();
		}
	}

	ngOnDestroy(): void {
		this.dataSource.disconnect();
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<TeamMember>> {
		return this.teamsService.searchMembers(this.team, query, search, pagingOptions, {});
	}

	clearFilters() {
		this.dataSource.search('');
		this.filter.clearFilter();
	}

	addMembers() {
		this.dialogService
			.open<AddMembersModalReturn, AddMembersModalData>(AddMembersModalComponent, {
				data: {
					teamId: this.team._id
				}
			})
			.closed.pipe(
				isNotNullOrUndefined(),
				isDialogActionOK(),
				mapToDialogReturnData(),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((usersAdded) => {
				this.alertService.addAlert(`${usersAdded} user(s) added`, 'success', 5000);
				this.reloadTeamMembers();
			});
	}

	removeMember(member: TeamMember) {
		this.dialogService
			.confirm(
				'Remove member from team?',
				`Are you sure you want to remove member: "${member.name}" from this team?`,
				'Remove Member'
			)
			.closed.pipe(
				first(),
				filter((result) => result?.action === DialogAction.OK),
				switchMap(() => this.teamsService.removeMember(this.team, member._id)),
				switchMap(() => this.sessionService.reloadSession()),
				catchError((error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.alertService.addClientErrorAlert(error);
					}
					return of(null);
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => this.reloadTeamMembers());
	}

	updateRole(member: TeamMember, role: string) {
		// No update required
		if (member.role === role) {
			return;
		}

		// If user is removing their own admin, verify that they know what they're doing
		if (this.user?._id === member._id && member.role === 'admin' && role !== 'admin') {
			this.dialogService
				.confirm(
					'Remove "Team Admin" role?',
					"Are you sure you want to remove <strong>yourself</strong> from the Team Admin role?<br/>Once you do this, you will no longer be able to manage the members of this team. <br/><strong>This also means you won't be able to give the role back to yourself.</strong>",
					'Remove Admin'
				)
				.closed.pipe(
					first(),
					filter((result) => result?.action === DialogAction.OK),
					switchMap(() => this.doUpdateRole(member, role)),
					switchMap(() => this.sessionService.reloadSession()),
					catchError((error: unknown) => {
						if (error instanceof HttpErrorResponse) {
							this.alertService.addClientErrorAlert(error);
						}
						return of(null);
					}),
					takeUntilDestroyed(this.destroyRef)
				)
				.subscribe(() => {
					// If we successfully removed the role from ourselves, redirect away
					this.router.navigate(['/team']);
				});
		} else if (!member.explicit) {
			// Member is implicitly in team, should explicitly add this member with the desired role
			this.addMember(member, role);
		} else {
			this.doUpdateRole(member, role)
				.pipe(
					catchError((error: unknown) => {
						if (error instanceof HttpErrorResponse) {
							this.alertService.addClientErrorAlert(error);
						}
						return of(null);
					}),
					takeUntilDestroyed(this.destroyRef)
				)
				.subscribe(() => this.reloadTeamMembers());
		}
	}

	private addMember(member: TeamMember, role?: string) {
		if (null == this.team._id || null == member) {
			this.alertService.addAlert('Failed to add member. Missing member or teamId.');
			return;
		}

		this.teamsService
			.addMember(this.team, member._id, role)
			.pipe(
				switchMap(() => this.sessionService.reloadSession()),
				catchError((error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.alertService.addClientErrorAlert(error);
					}
					return of(null);
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => this.reloadTeamMembers());
	}

	private doUpdateRole(member: TeamMember, role: string, persist = true): Observable<any> {
		if (!persist) {
			member.role = role;
			member.roleDisplay = TeamRole.getDisplay(member.role);
			return of(member);
		}

		return this.teamsService.updateMemberRole(this.team, member._id, role);
	}

	private reloadTeamMembers() {
		this.dataSource.page(0);
	}
}

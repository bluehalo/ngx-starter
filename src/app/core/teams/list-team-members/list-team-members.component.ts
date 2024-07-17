import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpErrorResponse } from '@angular/common/http';
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	computed,
	inject,
	input,
	viewChild
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, filter, first, switchMap } from 'rxjs/operators';

import {
	PagingOptions,
	PagingResults,
	SearchInputComponent,
	SortDirection,
	isNotNullOrUndefined
} from '../../../common';
import {
	DialogAction,
	DialogService,
	isDialogActionOK,
	mapToDialogReturnData
} from '../../../common/dialog';
import { AgoDatePipe, UtcDatePipe } from '../../../common/pipes';
import { SystemAlertService } from '../../../common/system-alert';
import {
	AgoDateColumnComponent,
	AsyFilterDirective,
	AsyHeaderListFilterComponent,
	AsyHeaderSortComponent,
	AsySortDirective,
	AsyTableDataSource,
	AsyTableEmptyStateComponent,
	ListFilterOption,
	PaginatorComponent,
	TextColumnComponent
} from '../../../common/table';
import { SessionService } from '../../auth';
import { APP_SESSION } from '../../tokens';
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
		HasTeamRoleDirective,
		CdkTableModule,
		AsySortDirective,
		AsyFilterDirective,
		AsyHeaderSortComponent,
		AsyHeaderListFilterComponent,
		AsyTableEmptyStateComponent,
		PaginatorComponent,
		AgoDatePipe,
		UtcDatePipe,
		CdkMenu,
		CdkMenuTrigger,
		CdkMenuItem,
		TextColumnComponent,
		AgoDateColumnComponent,
		NgbTooltip
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTeamMembersComponent {
	readonly #destroyRef = inject(DestroyRef);
	readonly #dialogService = inject(DialogService);
	readonly #router = inject(Router);
	readonly #teamsService = inject(TeamsService);
	readonly #sessionService = inject(SessionService);
	readonly #alertService = inject(SystemAlertService);
	readonly #session = inject(APP_SESSION);

	readonly filter = viewChild.required(AsyFilterDirective);

	readonly team = input.required<Team>();

	readonly isTeamAdmin = computed(
		() => this.#session().isAdmin() || this.#session().hasTeamRole(this.team(), TeamRole.ADMIN)
	);

	readonly teamRoleOptions = TeamRole.ROLES;

	readonly typeFilterOptions: ListFilterOption[] = [
		{ display: 'Explicit', value: 'explicit', active: false, hide: false },
		{ display: 'Implicit', value: 'implicit', active: false, hide: false }
	];

	readonly roleFilterOptions = TeamRole.ROLES.map(
		(role) =>
			({
				display: role.label,
				value: role.role
			}) as ListFilterOption
	);

	readonly dataSource = new AsyTableDataSource<TeamMember>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		undefined,
		{
			sortField: 'name',
			sortDir: SortDirection.asc
		}
	);

	readonly columns = ['name', 'username', 'lastLogin', 'type', 'role', 'actions'];

	constructor() {
		this.#alertService.clearAllAlerts();

		// eslint-disable-next-line rxjs-angular/prefer-takeuntil
		toObservable(this.team).subscribe(() => {
			this.dataSource.reload();
		});
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<TeamMember>> {
		return this.#teamsService.searchMembers(this.team(), query, search, pagingOptions, {});
	}

	clearFilters() {
		this.dataSource.search('');
		this.filter().clearFilter();
	}

	addMembers() {
		this.#dialogService
			.open<AddMembersModalReturn, AddMembersModalData>(AddMembersModalComponent, {
				data: {
					teamId: this.team()._id
				}
			})
			.closed.pipe(
				isNotNullOrUndefined(),
				isDialogActionOK(),
				mapToDialogReturnData(),
				takeUntilDestroyed(this.#destroyRef)
			)
			.subscribe((usersAdded) => {
				this.#alertService.addAlert(`${usersAdded} user(s) added`, 'success', 5000);
				this.reloadTeamMembers();
			});
	}

	removeMember(member: TeamMember) {
		this.#dialogService
			.confirm(
				'Remove member from team?',
				`Are you sure you want to remove member: "${member.name}" from this team?`,
				'Remove Member'
			)
			.closed.pipe(
				first(),
				filter((result) => result?.action === DialogAction.OK),
				switchMap(() => this.#teamsService.removeMember(this.team(), member._id)),
				switchMap(() => this.#sessionService.reloadSession()),
				catchError((error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.#alertService.addClientErrorAlert(error);
					}
					return of(null);
				}),
				takeUntilDestroyed(this.#destroyRef)
			)
			.subscribe(() => this.reloadTeamMembers());
	}

	updateRole(member: TeamMember, role: string) {
		// No update required
		if (member.role === role) {
			return;
		}

		// If user is removing their own admin, verify that they know what they're doing
		if (
			this.#session().user?._id === member._id &&
			member.role === 'admin' &&
			role !== 'admin'
		) {
			this.#dialogService
				.confirm(
					'Remove "Team Admin" role?',
					"Are you sure you want to remove <strong>yourself</strong> from the Team Admin role?<br/>Once you do this, you will no longer be able to manage the members of this team. <br/><strong>This also means you won't be able to give the role back to yourself.</strong>",
					'Remove Admin'
				)
				.closed.pipe(
					first(),
					filter((result) => result?.action === DialogAction.OK),
					switchMap(() => this.doUpdateRole(member, role)),
					switchMap(() => this.#sessionService.reloadSession()),
					catchError((error: unknown) => {
						if (error instanceof HttpErrorResponse) {
							this.#alertService.addClientErrorAlert(error);
						}
						return of(null);
					}),
					takeUntilDestroyed(this.#destroyRef)
				)
				.subscribe(() => {
					// If we successfully removed the role from ourselves, redirect away
					this.#router.navigate(['/team']);
				});
		} else if (!member.explicit) {
			// Member is implicitly in team, should explicitly add this member with the desired role
			this.addMember(member, role);
		} else {
			this.doUpdateRole(member, role)
				.pipe(
					catchError((error: unknown) => {
						if (error instanceof HttpErrorResponse) {
							this.#alertService.addClientErrorAlert(error);
						}
						return of(null);
					}),
					takeUntilDestroyed(this.#destroyRef)
				)
				.subscribe(() => this.reloadTeamMembers());
		}
	}

	private addMember(member: TeamMember, role?: string) {
		if (null == this.team()._id || null == member) {
			this.#alertService.addAlert('Failed to add member. Missing member or teamId.');
			return;
		}

		this.#teamsService
			.addMember(this.team(), member._id, role)
			.pipe(
				switchMap(() => this.#sessionService.reloadSession()),
				catchError((error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.#alertService.addClientErrorAlert(error);
					}
					return of(null);
				}),
				takeUntilDestroyed(this.#destroyRef)
			)
			.subscribe(() => this.reloadTeamMembers());
	}

	private doUpdateRole(member: TeamMember, role: string, persist = true): Observable<any> {
		if (!persist) {
			member.role = role;
			member.roleDisplay = TeamRole.getDisplay(member.role);
			return of(member);
		}

		return this.#teamsService.updateMemberRole(this.team(), member._id, role);
	}

	private reloadTeamMembers() {
		this.dataSource.page(0);
	}
}

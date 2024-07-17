import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import { AsyncPipe, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, filter, first, switchMap } from 'rxjs/operators';

import {
	CdkMenuItemRouterLinkDirective,
	PagingOptions,
	PagingResults,
	SearchInputComponent,
	SkipToDirective,
	SortDirection
} from '../../../../common';
import { DialogAction, DialogService } from '../../../../common/dialog';
import { JoinPipe } from '../../../../common/pipes';
import { SystemAlertComponent, SystemAlertService } from '../../../../common/system-alert';
import {
	ActionsMenuColumnComponent,
	ActionsMenuTemplateDirective,
	AgoDateColumnComponent,
	AsyExpandableListColumnComponent,
	AsyFilterDirective,
	AsyHeaderListFilterComponent,
	AsyHeaderSortComponent,
	AsySortDirective,
	AsyTableDataSource,
	AsyTableEmptyStateComponent,
	ColumnChooserComponent,
	DateColumnComponent,
	ItemTemplateDirective,
	PaginatorComponent,
	SidebarComponent,
	TextColumnComponent
} from '../../../../common/table';
import { Role, User } from '../../../auth';
import { ExportConfigService } from '../../../export-config.service';
import { APP_CONFIG } from '../../../tokens';
import { AdminUsersService } from '../admin-users.service';
import { UserRoleFilterDirective } from './user-role-filter.directive';

@Component({
	templateUrl: './admin-list-users.component.html',
	styleUrls: ['./admin-list-users.component.scss'],
	standalone: true,
	imports: [
		SkipToDirective,
		SystemAlertComponent,
		SearchInputComponent,
		RouterLink,
		CdkTableModule,
		OverlayModule,
		AsySortDirective,
		AsyFilterDirective,
		AsyHeaderSortComponent,
		AsyHeaderListFilterComponent,
		UserRoleFilterDirective,
		NgClass,
		AsyTableEmptyStateComponent,
		SidebarComponent,
		ColumnChooserComponent,
		PaginatorComponent,
		AsyncPipe,
		JoinPipe,
		CdkMenu,
		CdkMenuItem,
		CdkMenuItemRouterLinkDirective,
		AsyExpandableListColumnComponent,
		ItemTemplateDirective,
		DateColumnComponent,
		AgoDateColumnComponent,
		TextColumnComponent,
		ActionsMenuColumnComponent,
		ActionsMenuTemplateDirective,
		NgbTooltip
	]
})
export class AdminListUsersComponent implements OnInit {
	readonly #destroyRef = inject(DestroyRef);
	readonly #dialogService = inject(DialogService);
	readonly #adminUsersService = inject(AdminUsersService);
	readonly #exportConfigService = inject(ExportConfigService);
	readonly #alertService = inject(SystemAlertService);
	readonly #config = inject(APP_CONFIG);

	readonly filter = viewChild.required(AsyFilterDirective);

	readonly allowDeleteUser = computed(() => this.#config()?.allowDeleteUser ?? true);

	readonly possibleRoles: Role[] = Role.ROLES;

	readonly columns = [
		{
			key: 'name',
			label: 'Name',
			selected: true
		},
		{
			key: 'username',
			label: 'Username',
			selected: true
		},
		{
			key: '_id',
			label: 'ID',
			selected: false
		},
		{
			key: 'organization',
			label: 'Organization',
			selected: false
		},
		{
			key: 'phone',
			label: 'Phone',
			selected: false
		},
		{
			key: 'email',
			label: 'Email',
			selected: false
		},
		{
			key: 'acceptedEua',
			label: 'EUA',
			selected: false
		},
		{
			key: 'lastLogin',
			label: 'Last Login',
			selected: true
		},
		{
			key: 'created',
			label: 'Created',
			selected: false
		},
		{
			key: 'updated',
			label: 'Updated',
			selected: false
		},
		{
			key: 'externalRoles',
			label: 'External Roles',
			selected: false
		},
		{
			key: 'externalGroups',
			label: 'External Groups',
			selected: false
		},
		{
			key: 'roles',
			label: 'Roles',
			selected: true
		},
		{
			key: 'teams',
			label: 'Teams'
		}
	];

	readonly displayedColumns = signal<string[]>([]);

	readonly dataSource = new AsyTableDataSource<User>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		'admin-list-users-component',
		{
			sortField: 'lastLogin',
			sortDir: SortDirection.desc
		}
	);

	ngOnInit() {
		this.#alertService.clearAllAlerts();
		this.columnsChanged(this.columns.filter((c) => c.selected).map((c) => c.key));
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<User>> {
		return this.#adminUsersService.search(query, search, pagingOptions);
	}

	columnsChanged(columns: string[]) {
		setTimeout(() => {
			this.displayedColumns.set([...columns, 'actionsMenu']);
		});
	}

	clearFilters() {
		this.dataSource.search('');
		this.filter().clearFilter();
	}

	confirmDeleteUser(user: User) {
		this.#dialogService
			.confirm(
				'Delete user?',
				`Are you sure you want to delete the user: <strong>"${user.name}"</strong>?<br/>This action cannot be undone.`,
				'Delete'
			)
			.closed.pipe(
				first(),
				filter((result) => result?.action === DialogAction.OK),
				switchMap(() => this.#adminUsersService.removeUser(user._id)),
				catchError((error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.#alertService.addClientErrorAlert(error);
					}
					return of(null);
				}),
				takeUntilDestroyed(this.#destroyRef)
			)
			.subscribe(() => this.dataSource.reload());
	}

	exportCurrentView() {
		const viewColumns = this.columns
			.filter((column) => this.displayedColumns().includes(column.key))
			.map((column) => ({ key: column.key, title: column.label }));

		this.#exportConfigService
			.postExportConfig('user', {
				q: this.dataSource.filterEvent$.value,
				s: this.dataSource.searchEvent$.value,
				sort: this.dataSource.sortEvent$.value.sortField,
				dir: this.dataSource.sortEvent$.value.sortDir,
				cols: viewColumns
			})
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((response: any) => {
				window.open(`/api/admin/users/csv/${response._id}`);
			});
	}
}

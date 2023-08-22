import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable, of } from 'rxjs';
import { catchError, filter, first, map, switchMap } from 'rxjs/operators';

import { CdkMenuItemRouterLinkDirective } from '../../../../common/cdk-menu-item-router-link.directive';
import { DialogAction, DialogService } from '../../../../common/dialog';
import { SkipToDirective } from '../../../../common/directives/skip-to.directive';
import { PagingOptions, PagingResults } from '../../../../common/paging.model';
import { AgoDatePipe } from '../../../../common/pipes/ago-date.pipe';
import { JoinPipe } from '../../../../common/pipes/join.pipe';
import { UtcDatePipe } from '../../../../common/pipes/utc-date-pipe/utc-date.pipe';
import { SearchInputComponent } from '../../../../common/search-input/search-input.component';
import { SortDirection } from '../../../../common/sorting.model';
import { SystemAlertComponent } from '../../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { AsyTableDataSource } from '../../../../common/table/asy-table-data-source';
import { ColumnChooserComponent } from '../../../../common/table/column-chooser/column-chooser.component';
import { AsyFilterDirective } from '../../../../common/table/filter/asy-filter.directive';
import { AsyHeaderListFilterComponent } from '../../../../common/table/filter/asy-header-list-filter/asy-header-list-filter.component';
import { PaginatorComponent } from '../../../../common/table/paginator/paginator.component';
import { SidebarComponent } from '../../../../common/table/sidebar/sidebar.component';
import { AsySortHeaderComponent } from '../../../../common/table/sort/asy-sort-header/asy-sort-header.component';
import { AsySortDirective } from '../../../../common/table/sort/asy-sort.directive';
import { AsyTableEmptyStateComponent } from '../../../../common/table/table-empty-state/asy-table-empty-state.component';
import { Role } from '../../../auth/role.model';
import { User } from '../../../auth/user.model';
import { ConfigService } from '../../../config.service';
import { ExportConfigService } from '../../../export-config.service';
import { AdminUsersService } from '../admin-users.service';
import { UserRoleFilterDirective } from './user-role-filter.directive';

@UntilDestroy()
@Component({
	templateUrl: './admin-list-users.component.html',
	styleUrls: ['./admin-list-users.component.scss'],
	standalone: true,
	imports: [
		SkipToDirective,
		SystemAlertComponent,
		SearchInputComponent,
		RouterLink,
		TooltipModule,
		CdkTableModule,
		OverlayModule,
		AsySortDirective,
		AsyFilterDirective,
		AsySortHeaderComponent,
		AsyHeaderListFilterComponent,
		UserRoleFilterDirective,
		NgFor,
		NgIf,
		NgClass,
		AsyTableEmptyStateComponent,
		SidebarComponent,
		ColumnChooserComponent,
		PaginatorComponent,
		AsyncPipe,
		AgoDatePipe,
		JoinPipe,
		UtcDatePipe,
		CdkMenuTrigger,
		CdkMenu,
		CdkMenuItem,
		CdkMenuItemRouterLinkDirective
	]
})
export class AdminListUsersComponent implements OnDestroy, OnInit {
	@ViewChild(AsyFilterDirective)
	filter: AsyFilterDirective;

	possibleRoles: Role[] = Role.ROLES;

	columns = [
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
			key: 'id',
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
	displayedColumns: string[] = [];

	allowDeleteUser$: Observable<boolean>;

	dataSource = new AsyTableDataSource<User>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		'admin-list-users-component',
		{
			sortField: 'lastLogin',
			sortDir: SortDirection.desc
		}
	);

	private dialogService = inject(DialogService);

	constructor(
		public router: Router,
		private route: ActivatedRoute,
		private adminUsersService: AdminUsersService,
		private exportConfigService: ExportConfigService,
		private alertService: SystemAlertService,
		private configService: ConfigService
	) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();
		this.columnsChanged(this.columns.filter((c) => c.selected).map((c) => c.key));
		this.allowDeleteUser$ = this.configService.getConfig().pipe(
			map((config) => config?.allowDeleteUser ?? true),
			untilDestroyed(this)
		);
	}

	ngOnDestroy() {
		this.dataSource.disconnect();
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<User>> {
		return this.adminUsersService.search(query, search, pagingOptions);
	}

	columnsChanged(columns: string[]) {
		setTimeout(() => {
			this.displayedColumns = [...columns, 'actionsMenu'];
		});
	}

	clearFilters() {
		this.dataSource.search('');
		this.filter.clearFilter();
	}

	confirmDeleteUser(user: User) {
		this.dialogService
			.confirm(
				'Delete user?',
				`Are you sure you want to delete the user: <strong>"${user.userModel.name}"</strong>?<br/>This action cannot be undone.`,
				'Delete'
			)
			.closed.pipe(
				first(),
				filter((result) => result?.action === DialogAction.OK),
				switchMap(() => this.adminUsersService.removeUser(user.userModel._id)),
				catchError((error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.alertService.addClientErrorAlert(error);
					}
					return of(null);
				}),
				untilDestroyed(this)
			)
			.subscribe(() => this.dataSource.reload());
	}

	exportCurrentView() {
		const viewColumns = this.columns
			.filter((column) => this.displayedColumns.includes(column.key))
			.map((column) => ({ key: column.key, title: column.label }));

		const rolesIndex = viewColumns.findIndex((pair: any) => pair.key === 'roles');

		if (rolesIndex !== -1) {
			const roleColumns = Role.ROLES.map((role) => {
				return { key: `roles.${role.role}`, title: `${role.label} Role` };
			});
			viewColumns.splice(rolesIndex, 1, ...roleColumns);
		}

		this.exportConfigService
			.postExportConfig('user', {
				q: this.dataSource.filterEvent$.value,
				s: this.dataSource.searchEvent$.value,
				sort: this.dataSource.sortEvent$.value.sortField,
				dir: this.dataSource.sortEvent$.value.sortDir,
				cols: viewColumns
			})
			.pipe(untilDestroyed(this))
			.subscribe((response: any) => {
				window.open(`/api/admin/users/csv/${response._id}`);
			});
	}
}

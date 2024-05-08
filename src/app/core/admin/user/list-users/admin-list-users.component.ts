import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import { AsyncPipe, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
	Component,
	DestroyRef,
	OnDestroy,
	OnInit,
	ViewChild,
	computed,
	inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable, of } from 'rxjs';
import { catchError, filter, first, switchMap } from 'rxjs/operators';

import { CdkMenuItemRouterLinkDirective } from '../../../../common/cdk-menu-item-router-link.directive';
import { DialogAction, DialogService } from '../../../../common/dialog';
import { SkipToDirective } from '../../../../common/directives/skip-to.directive';
import { PagingOptions, PagingResults } from '../../../../common/paging.model';
import { JoinPipe } from '../../../../common/pipes/join.pipe';
import { SearchInputComponent } from '../../../../common/search-input/search-input.component';
import { SortDirection } from '../../../../common/sorting.model';
import { SystemAlertComponent } from '../../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import {
	AgoDateColumnComponent,
	AsyExpandableListColumnComponent,
	AsyFilterDirective,
	AsyHeaderListFilterComponent,
	AsySortDirective,
	AsySortHeaderComponent,
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
		TooltipModule,
		CdkTableModule,
		OverlayModule,
		AsySortDirective,
		AsyFilterDirective,
		AsySortHeaderComponent,
		AsyHeaderListFilterComponent,
		UserRoleFilterDirective,
		NgClass,
		AsyTableEmptyStateComponent,
		SidebarComponent,
		ColumnChooserComponent,
		PaginatorComponent,
		AsyncPipe,
		JoinPipe,
		CdkMenuTrigger,
		CdkMenu,
		CdkMenuItem,
		CdkMenuItemRouterLinkDirective,
		AsyExpandableListColumnComponent,
		ItemTemplateDirective,
		DateColumnComponent,
		AgoDateColumnComponent,
		TextColumnComponent
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
	displayedColumns: string[] = [];

	dataSource = new AsyTableDataSource<User>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		'admin-list-users-component',
		{
			sortField: 'lastLogin',
			sortDir: SortDirection.desc
		}
	);

	private destroyRef = inject(DestroyRef);
	private dialogService = inject(DialogService);
	private adminUsersService = inject(AdminUsersService);
	private exportConfigService = inject(ExportConfigService);
	private alertService = inject(SystemAlertService);
	private config = inject(APP_CONFIG);

	allowDeleteUser = computed(() => this.config()?.allowDeleteUser ?? true);

	ngOnInit() {
		this.alertService.clearAllAlerts();
		this.columnsChanged(this.columns.filter((c) => c.selected).map((c) => c.key));
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
				`Are you sure you want to delete the user: <strong>"${user.name}"</strong>?<br/>This action cannot be undone.`,
				'Delete'
			)
			.closed.pipe(
				first(),
				filter((result) => result?.action === DialogAction.OK),
				switchMap(() => this.adminUsersService.removeUser(user._id)),
				catchError((error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.alertService.addClientErrorAlert(error);
					}
					return of(null);
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => this.dataSource.reload());
	}

	exportCurrentView() {
		const viewColumns = this.columns
			.filter((column) => this.displayedColumns.includes(column.key))
			.map((column) => ({ key: column.key, title: column.label }));

		this.exportConfigService
			.postExportConfig('user', {
				q: this.dataSource.filterEvent$.value,
				s: this.dataSource.searchEvent$.value,
				sort: this.dataSource.sortEvent$.value.sortField,
				dir: this.dataSource.sortEvent$.value.sortDir,
				cols: viewColumns
			})
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((response: any) => {
				window.open(`/api/admin/users/csv/${response._id}`);
			});
	}
}

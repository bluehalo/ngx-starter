import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import toString from 'lodash/toString';
import { Observable, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import {
	PagingOptions,
	PagingResults,
	SortDirection,
	SortableTableHeader,
	AbstractPageableDataComponent, SortChange
} from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert.module';

import { User } from '../../auth/user.model';
import { Role } from '../../auth/role.model';
import { ConfigService } from '../../config.service';
import { AdminUsersService } from './admin-users.service';
import { AdminTopics } from '../admin-topic.model';

@Component({
	templateUrl: './admin-list-users.component.html'
})
export class AdminListUsersComponent extends AbstractPageableDataComponent<User> implements OnDestroy, OnInit {

	// Columns to show/hide in user table
	columns: any = {
		name: { show: true, display: 'Name' },
		username: { show: true, display: 'Username' },
		_id: { show: false, display: 'ID' },
		// teams: { show: true, display: 'Teams' },
		organization: { show: false, display: 'Organization' },
		email: { show: false, display: 'Email' },
		phone: { show: false, display: 'Phone' },
		acceptedEua: { show: false, display: 'EUA' },
		lastLogin: { show: true, display: 'Last Login' },
		created: { show: false, display: 'Created' },
		updated: { show: false, display: 'Updated' },
		bypassAccessCheck: { show: false, display: 'Bypass AC' },
		externalRoles: { show: false, display: 'External Roles' },
		externalGroups: { show: false, display: 'External Groups' },
		roles: { show: true, display: 'Roles' }
	};

	defaultColumns: any = JSON.parse(JSON.stringify(this.columns));

	headers: SortableTableHeader[] = [
		{ name: 'Name', sortable: true, sortField: 'name', sortDir: SortDirection.asc, tooltip: 'Sort by Name', default: true },
		{ name: 'Username', sortable: true, sortField: 'username', sortDir: SortDirection.asc, tooltip: 'Sort by Username' },
		{ name: 'ID', sortable: false, sortField: '_id'},
		// { name: 'Teams', sortable: false },
		{ name: 'Organization', sortable: false, sortField: 'organization' },
		{ name: 'Email', sortable: false, sortField: 'email' },
		{ name: 'Phone', sortable: false, sortField: 'phone' },
		{ name: 'EUA', sortable: false, sortField: 'acceptedEua' },
		{ name: 'Last Login', sortable: true, sortField: 'lastLogin', sortDir: SortDirection.desc, tooltip: 'Sort by Last Login' },
		{ name: 'Created', sortable: true, sortField: 'created', sortDir: SortDirection.desc, tooltip: 'Sort by Create Date' },
		{ name: 'Updated', sortable: false, sortField: 'updated' },
		{ name: 'Bypass AC', sortable: false, sortField: 'bypassAccessCheck' },
		{ name: 'External Roles', sortable: false, sortField: 'externalRoles' },
		{ name: 'External Groups', sortable: false, sortField: 'externalGroups' },
		{ name: 'Roles', sortable: false, sortField: 'roles' }
	];

	headersToShow: SortableTableHeader[] = [];

	possibleRoles: Role[] = Role.ROLES;

	private requiredExternalRoles: string[];

	private destroy$: Subject<boolean> = new Subject();

	constructor(
		private route: ActivatedRoute,
		private configService: ConfigService,
		private adminUsersService: AdminUsersService,
		private alertService: SystemAlertService
	) { super(); }

	ngOnInit() {
		this.route.params
			.pipe(
				takeUntil(this.destroy$)
			).subscribe((params: Params) => {
				// Clear any alerts
				this.alertService.clearAllAlerts();

				// Clear cache if requested
				const clearCachedFilter = params[`clearCachedFilter`];
				if (toString(clearCachedFilter) === 'true' || null == this.adminUsersService.cache.listUsers) {
					this.adminUsersService.cache.listUsers = {};
				}
			});

		this.configService.getConfig()
			.pipe(
				first(),
				takeUntil(this.destroy$)
			).subscribe(
			(config: any) => {
				this.requiredExternalRoles = isArray(config.requiredRoles) ? config.requiredRoles : [];

				this.headersToShow = this.headers.filter((header: SortableTableHeader) => this.columns.hasOwnProperty(header.sortField) && this.columns[header.sortField].show);

				this.sortEvent$.next(this.headers.find((header: any) => header.default) as SortChange);

				this.initializeFromCache();

				super.ngOnInit();
			});
	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	confirmDeleteUser(user: User) {
		const id = user.userModel._id;
		const username = user.userModel.username;

		console.log('Delete User not yet implemented.');
	}

	exportUserData() {
		console.log('Export User Data coming soon...');
	}

	exportCurrentView() {
		console.log('Export Current View coming soon...');
	}

	columnsUpdated(updatedColumns: any) {
		this.columns = cloneDeep(updatedColumns);
		this.headersToShow = this.headers.filter((header: SortableTableHeader) => this.columns.hasOwnProperty(header.sortField) && this.columns[header.sortField].show);
	}

	/**
	 * Initialize query, search, and paging options, possibly from cached user settings
	 */
	private initializeFromCache() {
		const cachedFilter = this.adminUsersService.cache.listUsers;

		this.filterEvent$.next(cachedFilter.filters || this.getDefaultQuickFilters());
		this.searchEvent$.next(cachedFilter.search);

		if (cachedFilter.paging) {
			this.pageEvent$.next(cachedFilter.paging);
			this.sortEvent$.next(cachedFilter.paging);
		}
	}

	private getDefaultQuickFilters() {
		const roles: any = {
			bypassAC: { show: false, display: 'Bypass AC' },
		};

		Role.ROLES.forEach((role) => {
			if (role.role !== 'user') {
				roles[`${role.role}Role`] = {show: false, display: role.label};
			}
		});

		roles.pending = { show: false, display: 'Pending' };

		return roles;
	}

	loadData(pagingOptions: PagingOptions, search: string, query: any): Observable<PagingResults<User>> {
		this.adminUsersService.cache.listUsers = {
			filters: this.filters,
			search,
			paging: pagingOptions
		};

		return this.adminUsersService.search(query, search, pagingOptions, {});
	}

	getQuery(): any {
		let query: any;
		const elements: any[] = [];

		if (this.filters.bypassAC.show) {
			elements.push({ bypassAccessCheck: true });
		}

		Role.ROLES.forEach((role) => {
			const filter = this.filters[`${role.role}Role`];
			if (filter != null && filter.show) {
				const element = {};
				element[`roles.${role.role}`] = true;
				elements.push(element);
			}
		});

		if (this.filters.pending.show) {
			const filter: any = {
				$or: [ { 'roles.user': {$ne: true} } ]
			};
			if (this.requiredExternalRoles.length > 0) {
				filter.$or.push({ $and: [
					{bypassAccessCheck: {$ne: true}},
					{externalRoles: {$not: {$all: this.requiredExternalRoles}}}
				]
				});
			}
			elements.push(filter);
		}

		if (elements.length > 0) {
			query = { $or: elements };
		}
		return query;
	}

}

AdminTopics.registerTopic({
	id: 'users',
	title: 'User',
	ordinal: 0,
	path: 'users'
});

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import toString from 'lodash/toString';
import { Observable, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { PagingOptions, PagingResults, SortDirection, SortDisplayOption, SortableTableHeader } from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';

import { User } from '../../auth/user.model';
import { Role } from '../../auth/role.model';
import { ConfigService } from '../../config.service';
import { AdminUsersService } from './admin-users.service';
import { AdminTopics } from '../admin-topic.model';

@Component({
	templateUrl: './admin-list-users.component.html'
})
export class AdminListUsersComponent implements OnDestroy, OnInit {

	users: any[] = [];

	pagingOpts: PagingOptions;

	search: string = '';

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
		{ name: 'Name', sortField: 'name', sortDir: SortDirection.asc, sortable: true, tooltip: 'Sort by Name', default: true },
		{ name: 'Username', sortField: 'username', sortDir: SortDirection.asc, sortable: true, tooltip: 'Sort by Username' },
		{ name: 'ID', sortField: '_id', sortable: false },
		// { name: 'Teams', sortField: 'teams', sortable: false },
		{ name: 'Organization', sortField: 'organization', sortable: false },
		{ name: 'Email', sortField: 'email', sortable: false },
		{ name: 'Phone', sortField: 'phone', sortable: false },
		{ name: 'EUA', sortField: 'acceptedEua', sortable: false },
		{ name: 'Last Login', sortField: 'lastLogin', sortable: false },
		{ name: 'Created', sortField: 'created', sortDir: SortDirection.desc, sortable: true, tooltip: 'Sort by Create Date' },
		{ name: 'Updated', sortField: 'updated', sortable: false },
		{ name: 'Bypass AC', sortField: 'bypassAccessCheck', sortable: false },
		{ name: 'External Roles', sortField: 'externalRoles', sortable: false },
		{ name: 'External Groups', sortField: 'externalGroups', sortable: false },
		{ name: 'Roles', sortField: 'roles', sortable: false }
	];

	headersToShow: SortableTableHeader[] = [];

	quickFilters: any = {};

	possibleRoles: Role[] = Role.ROLES;

	private requiredExternalRoles: string[];

	private destroy$: Subject<boolean> = new Subject();

	constructor(
		private route: ActivatedRoute,
		private configService: ConfigService,
		private adminUsersService: AdminUsersService,
		private alertService: SystemAlertService
	) {}

	ngOnInit() {
		this.route.params
			.pipe(
				takeUntil(this.destroy$)
			).subscribe((params: Params) => {
				// Clear any alerts
				this.alertService.clearAllAlerts();

				// Clear cache if requested
				let clearCachedFilter = params[`clearCachedFilter`];
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
				this.initialize();
				this.loadUsers();
			});
	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	onSearch(search: string) {
		this.search = search;
		this.applySearch();
	}

	applySearch() {
		this.pagingOpts.setPageNumber(0);
		this.loadUsers();
	}

	goToPage(event: any) {
		this.pagingOpts.update(event.pageNumber, event.pageSize);
		this.loadUsers();
	}

	setSort(sortOpt: SortDisplayOption) {
		this.pagingOpts.sortField = sortOpt.sortField;
		this.pagingOpts.sortDir = sortOpt.sortDir;
		this.loadUsers();
	}

	confirmDeleteUser(user: User) {
		const id = user.userModel._id;
		const username = user.userModel.username;
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

	quickFiltersUpdated(updatedFilters: any) {
		this.quickFilters = cloneDeep(updatedFilters);
		this.applySearch();
	}

	/**
	 * Initialize query, search, and paging options, possibly from cached user settings
	 */
	private initialize() {
		let cachedFilter = this.adminUsersService.cache.listUsers;

		this.search = cachedFilter.search ? cachedFilter.search : '';
		this.quickFilters = cachedFilter.filters ? cachedFilter.filters : this.getDefaultQuickFilters();

		if (cachedFilter.paging) {
			this.pagingOpts = cachedFilter.paging;
		} else {
			this.pagingOpts = new PagingOptions();

			const defaultSort = this.headers.find((header: any) => header.default);
			if (null != defaultSort) {
				this.pagingOpts.sortField = defaultSort.sortField;
				this.pagingOpts.sortDir = defaultSort.sortDir;
			}
		}
	}

	private getDefaultQuickFilters() {
		let roles: any = {
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

	private loadUsers() {
		let options: any = {};

		this.adminUsersService.cache.listUsers = {
			filters: this.quickFilters,
			search: this.search,
			paging: this.pagingOpts
		};

		let obs: Observable<PagingResults> = this.adminUsersService.search(this.getQuery(), this.search, this.pagingOpts, options);

		obs.subscribe((result: PagingResults) => {
			this.users = result.elements;

			if (this.users.length > 0) {
				this.pagingOpts.set(result.pageNumber, result.pageSize, result.totalPages, result.totalSize);
			} else {
				this.pagingOpts.reset();
			}
		});
	}

	private getQuery(): any {
		let query: any;
		let elements: any[] = [];

		if (this.quickFilters.bypassAC.show) {
			elements.push({ bypassAccessCheck: true });
		}

		Role.ROLES.forEach((role) => {
			let filter = this.quickFilters[`${role.role}Role`];
			if (filter != null && filter.show) {
				let element = {};
				element[`roles.${role.role}`] = true;
				elements.push(element);
			}
		});

		if (this.quickFilters.pending.show) {
			let filter: any = {
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
AdminTopics.registerTopic('users', 0);

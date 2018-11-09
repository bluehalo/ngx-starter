import { Component, ViewChild } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Params } from '@angular/router';

import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';

import { User } from '../../auth/user.model';
import { Role } from '../../auth/role.model';
import { ConfigService } from '../../config.service';
import { AdminUsersService } from './admin-users.service';
import { Pager, PagingOptions, SortDirection,
	SortDisplayOption, SortControls, TableSortOptions } from '../../../common/paging.module';

@Component({
	templateUrl: './admin-list-users.component.html'
})
export class AdminListUsersComponent {

	users: any[] = [];

	search: string = '';

	// Columns to show/hide in user table
	columns: any = {
		name: {show: true, title: 'Name'},
		username: {show: true, title: 'Username'},
		_id: {show: false, title: 'ID'},
		teams: {show: false, title: 'Teams'},
		organization: {show: false, title: 'Organization'},
		email: {show: false, title: 'Email'},
		phone: {show: false, title: 'Phone'},
		acceptedEua: {show: false, title: 'EUA'},
		lastLogin: {show: true, title: 'Last Login'},
		created: {show: false, title: 'Created'},
		updated: {show: false, title: 'Updated'},
		bypassAccessCheck: {show: false, title: 'Bypass AC'},
		externalRoles: {show: false, title: 'External Roles'},
		externalGroups: {show: false, title: 'External Groups'},
		roles: {show: true, title: 'Roles'}
	};

	columnKeys: string[] = _.keys(this.columns) as string[];

	columnMode: string = 'default';

	pagingOpts: PagingOptions;

	sortOpts: TableSortOptions = {
		name: new SortDisplayOption('Name', 'name', SortDirection.asc),
		username: new SortDisplayOption('Username', 'username', SortDirection.asc),
		created: new SortDisplayOption('Created', 'created', SortDirection.desc),
		relevance: new SortDisplayOption('Relevance', 'score', SortDirection.desc)
	};

	filters: any;

	possibleRoles: Role[] = Role.ROLES;

	private sub: Subscription;

	private defaultColumns: any = JSON.parse(JSON.stringify(this.columns));

	private requiredExternalRoles: string[];

	constructor(
		private route: ActivatedRoute,
		private configService: ConfigService,
		private adminUsersService: AdminUsersService
	) {}

	ngOnInit() {
		this.sub = this.route.params.subscribe((params: Params) => {

			// Clear cache if requested
			let clearCachedFilter = params[`clearCachedFilter`];
			if (_.toString(clearCachedFilter) === 'true' || null == this.adminUsersService.cache.listUsers) {
				this.adminUsersService.cache.listUsers = {};
			}

			this.configService.getConfig().subscribe(
				(config: any) => {
					this.requiredExternalRoles = _.isArray(config.requiredRoles) ? config.requiredRoles : [];

					this.initialize();
					this.loadUsers();
				});
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
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

	checkColumnConfiguration() {
			// Check first to see if all columns are turned on
		this.columnMode = 'all';
		this.columnKeys.some((name: string) => {
			if (this.columns[name].show !== true) {
				this.columnMode = 'custom';
				return true;
			}
		});

		if (this.columnMode === 'all') {
			return;
		}

		// Check if our default columns are enabled
		this.columnMode = 'default';
		this.columnKeys.some( (name: string) => {
			if (this.columns[name].show !== this.defaultColumns[name].show) {
				this.columnMode = 'custom';
				return true;
			}
		});
	}

	quickColumnSelect(selection: string) {
		if (selection === 'all') {
			this.columnKeys.forEach( (name: string) =>	this.columns[name].show = true);

		} else if (selection === 'default') {
			this.columns = JSON.parse(JSON.stringify(this.defaultColumns));
		}
		this.checkColumnConfiguration();
	}

	/**
	 * Initialize query, search, and paging options, possibly from cached user settings
	 */
	private initialize() {
		let cachedFilter = this.adminUsersService.cache.listUsers;

		this.search = cachedFilter.search ? cachedFilter.search : '';
		this.filters = cachedFilter.filters ? cachedFilter.filters : {
			bypassAC: false,
			editorRole: false,
			auditorRole: false,
			adminRole: false,
			pending: false
		};

		if (cachedFilter.paging) {
			this.pagingOpts = cachedFilter.paging;
		} else {
			this.pagingOpts = new PagingOptions();
			this.pagingOpts.sortField = this.sortOpts['name'].sortField;
			this.pagingOpts.sortDir = this.sortOpts['name'].sortDir;
		}

	}

	private loadUsers() {
		let options: any = {};

		this.adminUsersService.cache.listUsers = {
			filters: this.filters,
			search: this.search,
			paging: this.pagingOpts
		};

		let obs: Observable<Response> = this.adminUsersService.search(this.getQuery(), this.search, this.pagingOpts, options);

		obs.subscribe(
			(result: any) => {
				if (result && Array.isArray(result.elements)) {
					this.pagingOpts.set(result.pageNumber, result.pageSize, result.totalPages, result.totalSize);

					// Set the user list
					this.users = result.elements;

				} else {
					this.pagingOpts.reset();
				}
			},
			(_err: any): any => null );
	}

	private getQuery(): any {
		let query: any;
		let elements: any[] = [];

		if (this.filters.bypassAC) {
			elements.push({ bypassAccessCheck: true });
		}

		if (this.filters.editorRole) {
			elements.push({ 'roles.editor': true });
		}

		if (this.filters.auditorRole) {
			elements.push({ 'roles.auditor': true });
		}

		if (this.filters.adminRole) {
			elements.push({ 'roles.admin': true });
		}

		if (this.filters.pending) {
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

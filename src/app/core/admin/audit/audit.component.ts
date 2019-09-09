import { Component, OnInit } from '@angular/core';

import _isString from 'lodash/isString';
import { utc } from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Observable, forkJoin } from 'rxjs';

import { AuditService } from './audit.service';
import { AuditViewChangeModal, AuditViewDetailModal } from './audit-view-change.component';
import { PagingOptions, SortDisplayOption, SortDirection, SortableTableHeader, TableSortOptions, PagingResults } from '../../../common/paging.module';
import { AdminUsersService } from '../user-management/admin-users.service';
import { AuditOption } from './audit.classes';
import { AdminTopics } from '../admin-topic.model';


@Component({
	selector: 'audit',
	styleUrls: ['audit.scss'],
	templateUrl: './audit-list.component.html'
})
export class AuditComponent implements OnInit {

	// List of audit entries
	auditEntries: any[] = [];
	hasAuditEntries: boolean = false;

	actionOptions: AuditOption[] = [];
	actionsFormShown: boolean = true;
	actorFormShown: boolean = true;
	timestampFormShown: boolean = true;
	typeFormShown: boolean = true;

	auditTypeOptions: AuditOption[] = [];

	queryUserSearchTerm: string = '';

	// Search phrase
	search: string = '';

	pagingOpts: PagingOptions;

	sortOpts: TableSortOptions = {
		created: new SortDisplayOption('Created', 'created', SortDirection.desc),
		actor: new SortDisplayOption('Actor', 'audit.actor.name', SortDirection.asc),
		type: new SortDisplayOption('Type', 'audit.auditType', SortDirection.desc)
	};

	dateRangeOptions: any[];

	dateRangeFilter: any;

	queryStartDate: Date = utc().subtract(1, 'days').toDate();

	queryEndDate: Date = utc().toDate();

	searchUsersRef: Observable<any>;

	private userPagingOpts: PagingOptions;

	private queryUserObj: any;

	private auditEntriesLoaded: boolean = false;

	private auditModalRef: BsModalRef;

	constructor(
		private auditService: AuditService,
		private userService: AdminUsersService,
		private modalService: BsModalService
	) {}

	ngOnInit() {
		this.dateRangeOptions = [
			{ value: -1, display: 'Last 24 Hours' },
			{ value: -3, display: 'Last 3 Days' },
			{ value: -7, display: 'Last 7 Days' },
			{ value: 'everything', display: 'Everything' },
			{ value: 'choose', display: 'Select Date Range' }
		];

		this.pagingOpts = new PagingOptions();
		this.pagingOpts.sortField = this.sortOpts['created'].sortField;
		this.pagingOpts.sortDir = this.sortOpts['created'].sortDir;

		this.userPagingOpts = new PagingOptions(0, 20);
		this.userPagingOpts.sortField = 'username';
		this.userPagingOpts.sortDir = SortDirection.asc;

		// Default date range to last day
		this.dateRangeFilter = {
			selected: this.dateRangeOptions[0].value
		};

		// Bind the search users typeahead to a function
		this.searchUsersRef = Observable.create((observer: any) => {
			this.userService.match({}, this.queryUserSearchTerm, this.userPagingOpts, null)
				.subscribe((result: any) => {
					let formatted = result.elements
						.map((r: any) => {
							const user = r.userModel;
							r.displayName = user.name + ' [' + user.username + ']';
							return r;
						});
					observer.next(formatted);
				});
		});

		// Load action and audit type options from the server
		forkJoin([
			this.auditService.getDistinctAuditValues('audit.action'),
			this.auditService.getDistinctAuditValues('audit.auditType')
		]).subscribe((results: any[]) => {
			this.actionOptions = results[0].filter((r: any) => _isString(r)).sort().map((r: any) => new AuditOption(r));
			this.auditTypeOptions = results[1].filter((r: any) => _isString(r)).sort().map((r: any) => new AuditOption(r));
		});

		this.loadAuditEntries();
	}

	goToPage(event: any) {
		this.pagingOpts.update(event.pageNumber, event.pageSize);
		this.loadAuditEntries();
	}

	setSort(name: string) {
		if (name === this.pagingOpts.sortField) {
			// Same column, reverse direction
			this.pagingOpts.sortDir = (this.pagingOpts.sortDir === SortDirection.asc) ? SortDirection.desc : SortDirection.asc;
		}
		else {
			// New column selected, default to ascending sort
			this.pagingOpts.sortField = name;
			this.pagingOpts.sortDir = SortDirection.asc;
		}
		this.loadAuditEntries();
	}

	updateDateRange() {
		this.loadAuditEntries();
	}

	typeaheadOnSelect(e: any) {
		this.queryUserObj = e;
		this.refresh();
	}

	viewMore(auditEntry: any, type: string) {
		switch (type) {
			case 'viewDetails':
				this.auditModalRef = this.modalService.show(AuditViewDetailModal, { ignoreBackdropClick: true, class: 'modal-lg' });
				this.auditModalRef.content.auditEntry = auditEntry;
				break;
			case 'viewChanges':
				this.auditModalRef = this.modalService.show(AuditViewChangeModal, { ignoreBackdropClick: true, class: 'modal-lg' });
				this.auditModalRef.content.auditEntry = auditEntry;
				break;
			default:
				break;
		}
	}

	refresh() {
		this.pagingOpts.reset();

		// If actor search bar is empty, clear the actor object, otherwise retain it
		if (null == this.queryUserSearchTerm || this.queryUserSearchTerm.length === 0) {
			this.queryUserObj = null;
		}

		this.loadAuditEntries();
	}

	private getTimeFilterQueryObject(): any {
		let timeQuery: any = null;

		if (this.dateRangeFilter.selected === 'choose') {
			if (null != this.queryStartDate) {
				timeQuery = (null == timeQuery) ? {} : timeQuery;
				timeQuery.$gte = utc(this.queryStartDate).startOf('day');
			}
			if (null != this.queryEndDate) {
				timeQuery = (null == timeQuery) ? {} : timeQuery;
				timeQuery.$lt = utc(this.queryEndDate).endOf('day');
			}
		}
		else if (this.dateRangeFilter.selected !== 'everything') {
			timeQuery = {
				$gte: utc().add(this.dateRangeFilter.selected, 'days'),
				$lt: utc()
			};
		}

		return timeQuery;
	}

	private buildSearchQuery(): any {
		let query: any = {};

		if (null != this.queryUserObj && null != this.queryUserObj.item._id) {
			query['audit.actor._id'] = {
				$obj: this.queryUserObj.item._id
			};
		}

		let selectedActions = this.actionOptions.filter((opt) => opt.selected);
		if (selectedActions.length > 0) {
			query['audit.action'] = {
				$in: selectedActions.map((opt) => opt.display)
			};
		}

		let selectedAuditTypes = this.auditTypeOptions.filter((opt) => opt.selected);
		if (selectedAuditTypes.length > 0) {
			query['audit.auditType'] = {
				$in: selectedAuditTypes.map((opt) => opt.display)
			};
		}

		let created = this.getTimeFilterQueryObject();
		if (null != created) {
			query.created = created;
		}

		return query;
	}

	private loadAuditEntries() {
		let query = this.buildSearchQuery();

		this.auditService.search(query, '', this.pagingOpts)
			.subscribe((result: PagingResults) => {
				if (null != result && null != result.elements && result.elements.length > 0) {
					// Defensively filter out bad audit entries (null or audit or audit.object object is null)
					this.auditEntries = result.elements;
						// .filter((e: any) => (null != e && null != e.audit && null != e.audit.object));

					this.pagingOpts.set(result.pageNumber, result.pageSize, result.totalPages, result.totalSize);
					this.auditEntriesLoaded = true;
				}
				else {
					this.auditEntries = [];
					this.pagingOpts.reset();
					this.auditEntriesLoaded = false;
				}

				if (!this.hasAuditEntries) {
					this.hasAuditEntries = result.totalSize > 0;
				}
			});
	}
}

AdminTopics.registerTopic({
	id: 'audit',
	title: 'Audit',
	ordinal: 6,
	path: 'audit'
});


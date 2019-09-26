import { Component, OnInit } from '@angular/core';

import _get from 'lodash/get';
import _isString from 'lodash/isString';
import { utc } from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, forkJoin } from 'rxjs';

import { AuditService } from '../audit.service';
import { PagingOptions, SortDisplayOption, SortDirection, TableSortOptions, PagingResults } from '../../../common/paging.module';
import { AuditOption } from '../audit.classes';
import { AuditViewChangeModalComponent } from '../audit-view-change-modal/audit-view-change-modal.component';
import { AuditViewDetailsModalComponent } from '../audit-view-details-modal/audit-view-details-modal.component';
import { map, mergeMap } from 'rxjs/operators';

@Component({
	styleUrls: ['./list-audit-entries.component.scss'],
	templateUrl: './list-audit-entries.component.html'
})
export class ListAuditEntriesComponent implements OnInit {

	// List of audit entries
	auditEntries: any[] = [];
	hasAuditEntries = false;

	actionOptions: AuditOption[] = [];
	actionsFormShown = true;
	actorFormShown = true;
	timestampFormShown = true;
	typeFormShown = true;

	auditTypeOptions: AuditOption[] = [];

	queryUserSearchTerm = '';

	// Search phrase
	search = '';

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

	private auditEntriesLoaded = false;

	private auditModalRef: BsModalRef;

	constructor(
		private auditService: AuditService,
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
		this.pagingOpts.sortField = this.sortOpts.created.sortField;
		this.pagingOpts.sortDir = this.sortOpts.created.sortDir;

		this.userPagingOpts = new PagingOptions(0, 20);
		this.userPagingOpts.sortField = 'username';
		this.userPagingOpts.sortDir = SortDirection.asc;

		// Default date range to last day
		this.dateRangeFilter = {
			selected: this.dateRangeOptions[0].value
		};

		// Bind the search users typeahead to a function
		this.searchUsersRef = new Observable((observer: any) => {
			observer.next(this.queryUserSearchTerm);
		}).pipe(
			mergeMap((token: string) => this.auditService.matchUser({}, token, this.userPagingOpts, {})),
			map((result: PagingResults) => {
				return result.elements.map((r: any) => {
					r.displayName = `${r.userModel.name}  [${r.userModel.username}]`;
					return r;
				});
			})
		);

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
		} else {
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
				this.auditModalRef = this.modalService.show(AuditViewDetailsModalComponent, { ignoreBackdropClick: true, class: 'modal-lg' });
				this.auditModalRef.content.auditEntry = auditEntry;
				break;
			case 'viewChanges':
				this.auditModalRef = this.modalService.show(AuditViewChangeModalComponent, { ignoreBackdropClick: true, class: 'modal-lg' });
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
		} else if (this.dateRangeFilter.selected !== 'everything') {
			timeQuery = {
				$gte: utc().add(this.dateRangeFilter.selected, 'days'),
				$lt: utc()
			};
		}

		return timeQuery;
	}

	private buildSearchQuery(): any {
		const query: any = {};

		const actorId = _get(this.queryUserObj, 'item.userModel._id', null);
		if (null !== actorId) {
			query['audit.actor._id'] = {
				$obj: actorId
			};
		}

		const selectedActions = this.actionOptions.filter((opt) => opt.selected);
		if (selectedActions.length > 0) {
			query['audit.action'] = {
				$in: selectedActions.map((opt) => opt.display)
			};
		}

		const selectedAuditTypes = this.auditTypeOptions.filter((opt) => opt.selected);
		if (selectedAuditTypes.length > 0) {
			query['audit.auditType'] = {
				$in: selectedAuditTypes.map((opt) => opt.display)
			};
		}

		const created = this.getTimeFilterQueryObject();
		if (null != created) {
			query.created = created;
		}

		return query;
	}

	private loadAuditEntries() {
		const query = this.buildSearchQuery();

		this.auditService.search(query, '', this.pagingOpts)
			.subscribe((result: PagingResults) => {
				if (null != result && null != result.elements && result.elements.length > 0) {
					// Defensively filter out bad audit entries (null or audit or audit.object object is null)
					this.auditEntries = result.elements;
						// .filter((e: any) => (null != e && null != e.audit && null != e.audit.object));

					this.pagingOpts.set(result.pageNumber, result.pageSize, result.totalPages, result.totalSize);
					this.auditEntriesLoaded = true;

					this.enrichAuditEntries();
				} else {
					this.auditEntries = [];
					this.pagingOpts.reset();
					this.auditEntriesLoaded = false;
				}

				if (!this.hasAuditEntries) {
					this.hasAuditEntries = result.totalSize > 0;
				}
			});
	}

	private enrichAuditEntries() {
		this.auditEntries.forEach((entry) => {
			entry.isViewDetailsAction = this.auditService.isViewDetailsAction(entry.audit.action);
			entry.isViewChangesAction = this.auditService.isViewChangesAction(entry.audit.action);
		});
	}


}

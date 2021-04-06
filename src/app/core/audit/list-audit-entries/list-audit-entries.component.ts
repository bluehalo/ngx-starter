import { Component, OnInit } from '@angular/core';

import {
	AbstractPageableDataComponent,
	PagingOptions,
	PagingResults,
	SortableTableHeader,
	SortChange,
	SortDirection
} from '../../../common/paging.module';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import _isString from 'lodash/isString';
import { utc } from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AuditViewChangeModalComponent } from '../audit-view-change-modal/audit-view-change-modal.component';
import { AuditViewDetailsModalComponent } from '../audit-view-details-modal/audit-view-details-modal.component';
import { AuditOption } from '../audit.classes';
import { AuditService } from '../audit.service';

@UntilDestroy()
@Component({
	templateUrl: './list-audit-entries.component.html',
	styleUrls: ['./list-audit-entries.component.scss']
})
export class ListAuditEntriesComponent extends AbstractPageableDataComponent<any>
	implements OnInit {
	actionOptions: AuditOption[] = [];
	actionsFormShown = true;
	actorFormShown = true;
	timestampFormShown = true;
	typeFormShown = true;

	auditTypeOptions: AuditOption[] = [];

	queryUserSearchTerm = '';

	headers: SortableTableHeader[] = [
		{
			name: 'Actor',
			sortable: true,
			sortField: 'audit.actor.name',
			sortDir: SortDirection.asc,
			tooltip: 'Sort by Key',
			iconClass: 'fa-user'
		},
		{
			name: 'Timestamp',
			sortable: true,
			sortField: 'created',
			sortDir: SortDirection.desc,
			tooltip: 'Sort by Timestamp',
			iconClass: 'fa-clock-o',
			default: true
		},
		{
			name: 'Action',
			sortable: true,
			sortField: 'audit.action',
			sortDir: SortDirection.asc,
			tooltip: 'Sort by Action'
		},
		{
			name: 'Type',
			sortable: true,
			sortField: 'audit.auditType',
			sortDir: SortDirection.asc,
			tooltip: 'Sort by Type'
		},
		{ name: 'Object', sortable: false },
		{ name: 'Before', sortable: false, iconClass: 'fa-history' },
		{ name: 'Message', sortable: false, iconClass: 'fa-file-text-o' }
	];

	dateRangeOptions: any[];

	dateRangeFilter: any;

	queryStartDate: Date = utc()
		.subtract(1, 'days')
		.toDate();

	queryEndDate: Date = utc().toDate();

	searchUsersRef: Observable<any>;

	private userPagingOpts: PagingOptions;

	private queryUserObj: any;

	private auditModalRef: BsModalRef;

	constructor(private auditService: AuditService, private modalService: BsModalService) {
		super();
	}

	ngOnInit() {
		this.dateRangeOptions = [
			{ value: -1, display: 'Last 24 Hours' },
			{ value: -3, display: 'Last 3 Days' },
			{ value: -7, display: 'Last 7 Days' },
			{ value: 'everything', display: 'Everything' },
			{ value: 'choose', display: 'Select Date Range' }
		];

		this.userPagingOpts = new PagingOptions(0, 20);
		this.userPagingOpts.sortField = 'username';
		this.userPagingOpts.sortDir = SortDirection.asc;

		// Default date range to last day
		this.dateRangeFilter = {
			selected: this.dateRangeOptions[0].value
		};

		// Bind the search users typeahead to a function
		this.searchUsersRef = new Observable<string>((observer: any) => {
			observer.next(this.queryUserSearchTerm);
		}).pipe(
			mergeMap((token: string) =>
				this.auditService.matchUser({}, token, this.userPagingOpts, {})
			),
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
		])
			.pipe(untilDestroyed(this))
			.subscribe(([actionResults, typeResults]) => {
				this.actionOptions = actionResults
					.filter((r: any) => _isString(r))
					.sort()
					.map((r: any) => new AuditOption(r));
				this.auditTypeOptions = typeResults
					.filter((r: any) => _isString(r))
					.sort()
					.map((r: any) => new AuditOption(r));
			});

		this.sortEvent$.next(this.headers.find((header: any) => header.default) as SortChange);

		super.ngOnInit();
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<any>> {
		return this.auditService.search(query, search, pagingOptions);
	}

	typeaheadOnSelect(e: any) {
		this.queryUserObj = e;
		this.load$.next(true);
	}

	viewMore(auditEntry: any, type: string) {
		switch (type) {
			case 'viewDetails':
				this.auditModalRef = this.modalService.show(AuditViewDetailsModalComponent, {
					ignoreBackdropClick: true,
					class: 'modal-dialog-scrollable modal-lg'
				});
				this.auditModalRef.content.auditEntry = auditEntry;
				break;
			case 'viewChanges':
				this.auditModalRef = this.modalService.show(AuditViewChangeModalComponent, {
					ignoreBackdropClick: true,
					class: 'modal-dialog-scrollable modal-lg'
				});
				this.auditModalRef.content.auditEntry = auditEntry;
				break;
			default:
				break;
		}
	}

	getQuery(): any {
		const query: any = {};

		// If actor search bar is empty, clear the actor object, otherwise retain it
		if (null == this.queryUserSearchTerm || this.queryUserSearchTerm.length === 0) {
			this.queryUserObj = null;
		}

		const actorId = this.queryUserObj?.item?.userModel?._id;
		if (undefined !== actorId) {
			query['audit.actor._id'] = {
				$obj: actorId
			};
		}

		const selectedActions = this.actionOptions.filter(opt => opt.selected);
		if (selectedActions.length > 0) {
			query['audit.action'] = {
				$in: selectedActions.map(opt => opt.display)
			};
		}

		const selectedAuditTypes = this.auditTypeOptions.filter(opt => opt.selected);
		if (selectedAuditTypes.length > 0) {
			query['audit.auditType'] = {
				$in: selectedAuditTypes.map(opt => opt.display)
			};
		}

		const created = this.getTimeFilterQueryObject();
		if (null != created) {
			query.created = created;
		}

		return query;
	}

	private getTimeFilterQueryObject(): any {
		let timeQuery: any = null;

		if (this.dateRangeFilter.selected === 'choose') {
			if (null != this.queryStartDate) {
				timeQuery = null == timeQuery ? {} : timeQuery;
				timeQuery.$gte = utc(this.queryStartDate).startOf('day');
			}
			if (null != this.queryEndDate) {
				timeQuery = null == timeQuery ? {} : timeQuery;
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
}

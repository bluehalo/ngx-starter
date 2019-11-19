import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { filter, first, switchMap, takeUntil } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';
import toString from 'lodash/toString';

import { ModalAction, ModalService } from '../../../common/modal.module';
import {
	PagingOptions,
	PagingResults,
	SortDirection,
	SortableTableHeader,
	AbstractPageableDataComponent
} from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert.module';

import { EndUserAgreement } from './eua.model';
import { EuaService } from './eua.service';
import { AdminTopics } from '../admin-topic.model';

@Component({
	templateUrl: './admin-list-euas.component.html'
})
export class AdminListEuasComponent extends AbstractPageableDataComponent<EndUserAgreement> implements OnDestroy, OnInit {

	// Columns to show/hide in user table
	columns = {
		_id: { show: false, display: 'ID' },
		title: { show: true, display: 'Title' },
		text: { show: false, display: 'Text' },
		created: { show: true, display: 'Created' },
		published: { show: true, display: 'Published' },
		updated: { show: true, display: 'Updated' }
	};

	defaultColumns: any = JSON.parse(JSON.stringify(this.columns));

	headers: SortableTableHeader[] = [
		{ name: 'ID', sortable: false, sortField: '_id' },
		{ name: 'Title', sortable: true, sortField: 'title', sortDir: SortDirection.asc, tooltip: 'Sort by Title', default: true },
		{ name: 'Text', sortable: false, sortField: 'text' },
		{ name: 'Created', sortable: true, sortField: 'created', sortDir: SortDirection.desc, tooltip: 'Sort by Create Date' },
		{ name: 'Published', sortable: true, sortField: 'published', sortDir: SortDirection.desc, tooltip: 'Sort by Publish Date' },
		{ name: 'Updated', sortable: true, sortField: 'updated', sortDir: SortDirection.asc, tooltip: 'Sort by Title' }
	];

	headersToShow: SortableTableHeader[] = [];

	private destroy$: Subject<boolean> = new Subject();

	constructor(
		private modalService: ModalService,
		private euaService: EuaService,
		private route: ActivatedRoute,
		private alertService: SystemAlertService
	) { super(); }

	ngOnInit() {
		this.alertService.clearAllAlerts();
		this.route.params
			.pipe(
				takeUntil(this.destroy$)
			).subscribe( (params: Params) => {
				if (toString(params[`clearCachedFilter`]) === 'true' || null == this.euaService.cache.listEuas) {
					this.euaService.cache.listEuas = {};
				}
			});

		this.headersToShow = this.headers.filter((header: SortableTableHeader) => this.columns.hasOwnProperty(header.sortField) && this.columns[header.sortField].show);

		this.initializeFromCache();

		super.ngOnInit();
	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	columnsUpdated(updatedColumns: any) {
		this.columns = cloneDeep(updatedColumns);
		this.headersToShow = this.headers.filter((header: SortableTableHeader) => this.columns.hasOwnProperty(header.sortField) && this.columns[header.sortField].show);
	}

	confirmDeleteEua(eua: EndUserAgreement) {
		const id = eua.euaModel._id;
		const title = eua.euaModel.title;

		this.modalService
			.confirm('Delete End User Agreement?', `Are you sure you want to delete eua: "${eua.euaModel.title}" ?`, 'Delete')
			.pipe(
				first(),
				filter((action: ModalAction) => action === ModalAction.OK),
				switchMap(() => {
					return this.euaService.remove(id);
				})
			).subscribe(() => {
				this.alertService.addAlert(`Deleted EUA entitled: ${title}`, 'success');
				this.load$.next(true);
			},
			(response: HttpErrorResponse) => {
				if (response.status >= 400 && response.status < 500) {
					this.alertService.addAlert(response.error.message);
				}
			});
	}

	publishEua(eua: EndUserAgreement) {
		this.euaService.publish(eua.euaModel._id).subscribe(
			() => {
				this.alertService.addAlert(`Published ${eua.euaModel.title}`, 'success');
				this.load$.next(true);
			},
			(response: HttpErrorResponse) => {
				if (response.status >= 400 && response.status < 500) {
					this.alertService.addAlert(response.error.message);
				}
			});
		this.load$.next(true);
	}

	/**
	 * Initialize query, search, and paging options, possibly from cached user settings
	 */
	private initializeFromCache() {
		const cachedFilter = this.euaService.cache.listEuas;

		this.searchEvent$.next(cachedFilter.search);

		if (cachedFilter.paging) {
			this.pageEvent$.next(cachedFilter.paging);
			this.sortEvent$.next(cachedFilter.paging);
		}
	}

	loadData(pagingOptions: PagingOptions, search: string, query: any): Observable<PagingResults<EndUserAgreement>> {
		this.euaService.cache.listEuas = {search, paging: pagingOptions};

		return this.euaService.search(query, search, pagingOptions, {});
	}
}

AdminTopics.registerTopic({
	id: 'end-user-agreements',
	title: 'EUAs',
	ordinal: 2,
	path: 'euas'
});

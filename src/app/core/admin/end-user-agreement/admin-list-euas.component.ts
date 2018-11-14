import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Response } from '@angular/http';

import { Subject } from 'rxjs';
import { filter, first, switchMap, takeUntil } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';
import toString from 'lodash/toString';

import { EndUserAgreement } from './eua.model';
import { EuaService } from './eua.service';
import { ModalAction, ModalService } from '../../../common/modal.module';
import { PagingOptions, PagingResults, SortDisplayOption, SortDirection, SortableTableHeader } from '../../../common/paging.module';
import { AdminTopics } from '../admin-topic.model';
import { SystemAlertService } from '../../../common/system-alert.module';

@Component({
	selector: 'admin-list-euas',
	templateUrl: './admin-list-euas.component.html'
})
export class AdminListEuasComponent implements OnDestroy, OnInit {

	pagingOpts: PagingOptions;

	euas: EndUserAgreement[] = [];

	search: string = '';

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
		{ name: 'ID', sortField: '_id', sortable: false },
		{ name: 'Title', sortField: 'title', sortDir: SortDirection.asc, sortable: true, tooltip: 'Sort by Title', default: true },
		{ name: 'Text', sortField: 'text', sortable: false },
		{ name: 'Created', sortField: 'created', sortDir: SortDirection.desc, sortable: true, tooltip: 'Sort by Create Date' },
		{ name: 'Published', sortField: 'published', sortDir: SortDirection.desc, sortable: true, tooltip: 'Sort by Publish Date' },
		{ name: 'Updated', sortField: 'updated', sortDir: SortDirection.asc, sortable: true, tooltip: 'Sort by Title' }
	];

	headersToShow: SortableTableHeader[] = [];

	private destroy$: Subject<boolean> = new Subject();

	constructor(
		private modalService: ModalService,
		private euaService: EuaService,
		private route: ActivatedRoute,
		private alertService: SystemAlertService
	) {}

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

		this.initializeUserFilters();

		this.loadEuas();
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
		this.loadEuas();
	}

	goToPage(event: any) {
		this.pagingOpts.update(event.pageNumber, event.pageSize);
		this.loadEuas();
	}

	setSort(sortOpt: SortDisplayOption) {
		this.pagingOpts.sortField = sortOpt.sortField;
		this.pagingOpts.sortDir = sortOpt.sortDir;
		this.loadEuas();
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
			)
			.subscribe(() => {
				this.alertService.addAlert(`Deleted EUA entitled: ${title}`, 'success');
				this.loadEuas();
			}, (response: Response) => {
				if (response.status >= 400 && response.status < 500) {
					this.alertService.addAlert(response.json().message);
				}
			});
	}

	publishEua(eua: EndUserAgreement) {
		this.euaService.publish(eua.euaModel._id).subscribe(
			() => {
				this.alertService.addAlert(`Published ${eua.euaModel.title}`, 'success');
				this.loadEuas();
			},
			(response: Response) => {
				if (response.status >= 400 && response.status < 500) {
					this.alertService.addAlert(response.json().message);
				}
			});
		this.loadEuas();
	}

	/**
	 * Initialize query, search, and paging options, possibly from cached user settings
	 */
	private initializeUserFilters() {
		let cachedFilter = this.euaService.cache.listEuas;

		this.search = cachedFilter.search ? cachedFilter.search : '';

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

	private loadEuas() {
		let options: any = {};
		this.euaService.cache.listEuas = {search: this.search, paging: this.pagingOpts};
		this.euaService.search(this.getQuery(), this.search, this.pagingOpts, options)
			.subscribe((result: PagingResults) => {
				if (result && Array.isArray(result.elements)) {
					this.euas = result.elements.map((element: any) => new EndUserAgreement().setFromEuaModel(element));
					this.pagingOpts.set(result.pageNumber, result.pageSize, result.totalPages, result.totalSize);
				} else {
					this.pagingOpts.reset();
					this.euas = [];
				}
			});
	}

	private getQuery(): any {
		let query: any;
		let elements: any[] = [];

		if (elements.length > 0) {
			query = { $or: elements };
		}
		return query;
	}

}
AdminTopics.registerTopic('euas', 0);

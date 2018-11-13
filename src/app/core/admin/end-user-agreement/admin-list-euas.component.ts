import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Response } from '@angular/http';

import { filter, first, switchMap } from 'rxjs/operators';

import { keys, toString } from 'lodash';

import { EndUserAgreement } from './eua.model';
import { EuaService } from './eua.service';
import { ModalAction, ModalService } from '../../../common/modal.module';
import { PagingOptions, SortDisplayOption, SortDirection, TableSortOptions } from '../../../common/paging.module';
import { AdminTopics } from '../admin-topic.model';

@Component({
	selector: 'admin-list-euas',
	templateUrl: './admin-list-euas.component.html'
})
export class AdminListEuasComponent implements OnInit {

	pagingOpts: PagingOptions;

	euas: EndUserAgreement[] = [];

	search: string = '';

	// Columns to show/hide in user table
	columns = {
		_id: { show: false, title: 'ID' },
		title: { show: true, title: 'Title' },
		text: { show: false, title: 'Text' },
		created: { show: true, title: 'Created' },
		updated: { show: true, title: 'Updated' },
		published: { show: true, title: 'Published' },
	};

	columnKeys: string[] = keys(this.columns) as string[];

	sortOpts: TableSortOptions = {
		title: new SortDisplayOption('Name', 'name', SortDirection.asc),
		created: new SortDisplayOption('Created', 'created', SortDirection.desc),
		updated: new SortDisplayOption('Updated', 'updated', SortDirection.desc),
		published: new SortDisplayOption('Published', 'published', SortDirection.desc),
		relevance: new SortDisplayOption('Relevance', 'score', SortDirection.desc)
	};

	constructor(
		private modalService: ModalService,
		private euaService: EuaService,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.route.params.subscribe( (params: Params) => {
			if (toString(params[`clearCachedFilter`]) === 'true' || null == this.euaService.cache.listEuas) {
				this.euaService.cache.listEuas = {};
			}
		});

		this.initializeUserFilters();

		this.loadEuas();
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
				// this.alertService.addAlert(`Deleted EUA entitled: ${title}`, 'success');
				this.loadEuas();
			}, (response: Response) => {
				if (response.status >= 400 && response.status < 500) {
					// this.alertService.addAlert(response.json().message);
				}
			});
	}

	publishEua(eua: EndUserAgreement) {
		this.euaService.publish(eua.euaModel._id).subscribe(
			() => {
				// this.alertService.addAlert(`Published ${eua.euaModel.title}`, 'success');
			},
			(response: Response) => {
				if (response.status >= 400 && response.status < 500) {
					// this.alertService.addAlert(response.json().message);
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
			this.pagingOpts.sortField = this.sortOpts['title'].sortField;
			this.pagingOpts.sortDir = this.sortOpts['title'].sortDir;
		}
	}

	private loadEuas() {
		let options: any = {};
		this.euaService.cache.listEuas = {search: this.search, paging: this.pagingOpts};
		this.euaService.search(this.getQuery(), this.search, this.pagingOpts, options)
			.subscribe((result: any) => {
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

AdminTopics.registerTopic({
	id: 'end-user-agreements',
	title: 'EUAs',
	ordinal: 0,
	path: 'euas'
});

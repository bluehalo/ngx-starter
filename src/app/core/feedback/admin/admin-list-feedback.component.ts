import { Component, OnInit } from '@angular/core';

import {
	PagingResults,
	PagingOptions,
	SortDirection,
	SortableTableHeader,
	PagingComponent
} from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert.module';
import { ExportConfigService } from '../../export-config.service';
import { AdminTopics } from '../../admin/admin.module';

import { FeedbackService } from '../feedback.service';

@Component({
	templateUrl: 'admin-list-feedback.component.html'
})
export class AdminListFeedbackComponent extends PagingComponent implements OnInit {

	feedbacks: any[];

	search: string;

	pagingOpts: PagingOptions;

	headers: SortableTableHeader[] = [
		{ name: 'Submitted By', sortField: 'audit.actor', sortDir: SortDirection.asc, sortable: true },
		{ name: 'Email', sortable: false },
		{ name: 'Type', sortField: 'type', sortDir: SortDirection.asc, sortable: true },
		{ name: 'Feedback', sortable: false },
		{ name: 'Submitted From', sortField: 'url', sortDir: SortDirection.asc, sortable: true },
		{ name: 'Browser', sortField: 'browser', sortDir: SortDirection.asc, sortable: true },
		{ name: 'OS', sortField: 'os', sortDir: SortDirection.asc, sortable: true },
		{ name: 'Submission Time', sortField: 'created', sortDir: SortDirection.desc, sortable: true, default: true }
	];

	constructor(
		private feedbackService: FeedbackService,
		private exportConfigService: ExportConfigService,
		private alertService: SystemAlertService
	) {
		super();
	}

	ngOnInit() {
		this.alertService.clearAllAlerts();

		this.pagingOpts = new PagingOptions();

		const defaultSort = this.headers.find((header: any) => header.default);
		if (null != defaultSort) {
			this.pagingOpts.sortField = defaultSort.sortField;
			this.pagingOpts.sortDir = defaultSort.sortDir;
		}

		this.loadFeedbackEntries();
	}

	loadData() {
		this.loadFeedbackEntries();
	}

	onSearch(search: string) {
		this.search = search;
		this.applySearch();
	}

	export() {
		this.exportConfigService
			.postExportConfig('feedback', { sort: this.pagingOpts.sortField, dir: this.pagingOpts.sortDir })
			.subscribe((response: any) => {
				window.open(`/api/admin/feedback/csv/${response._id}`);
			});
	}

	private loadFeedbackEntries() {
		this.feedbackService.getFeedback(this.pagingOpts, null, this.search, {}).subscribe((result: PagingResults) => {
			this.feedbacks = result.elements;
			if (this.feedbacks.length > 0) {
				this.pagingOpts.set(result.pageNumber, result.pageSize, result.totalPages, result.totalSize);
			} else {
				this.pagingOpts.reset();
			}
		});
	}
}

AdminTopics.registerTopic({
	id: 'feedback',
	title: 'Feedback',
	ordinal: 3,
	path: 'feedback'
});

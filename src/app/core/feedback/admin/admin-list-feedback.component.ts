import { Component, OnInit } from '@angular/core';

import { PagingComponent, PagingResults, PagingOptions, SortDirection, SortableTableHeader } from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert.module';
import { ExportConfigService } from '../../export-config.service';
import { AdminTopics } from '../../admin/admin.module';

import { FeedbackService } from '../feedback.service';

@Component({
	templateUrl: 'admin-list-feedback.component.html'
})
export class AdminListFeedbackComponent extends PagingComponent implements OnInit {

	feedbacks: any[];

	headers: SortableTableHeader[] = [
		{ name: 'Submitted By', sortField: 'audit.actor', sortDir: SortDirection.asc, sortable: true },
		{ name: 'Email', sortable: false },
		{ name: 'Type', sortable: false },
		{ name: 'Feedback', sortable: false },
		{ name: 'Submitted From', sortable: false },
		{ name: 'Submission Time', sortField: 'created', sortDir: SortDirection.desc, sortable: true, default: true }
	];

	constructor(
		private feedbackService: FeedbackService,
		private exportConfigService: ExportConfigService,
		private alertService: SystemAlertService
	) { super(); }

	ngOnInit() {
		this.alertService.clearAllAlerts();

		this.setDefaultPagingOptions();

		this.loadData();
	}

	export() {
		this.exportConfigService
			.postExportConfig('feedback', { sort: this.pagingOpts.sortField, dir: this.pagingOpts.sortDir })
			.subscribe((response: any) => {
				window.open(`/api/admin/feedback/csv/${response._id}`);
			});
	}

	loadData() {
		this.feedbackService.getFeedback(this.pagingOpts).subscribe((result: PagingResults) => {
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

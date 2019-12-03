import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
	PagingResults,
	PagingOptions,
	SortDirection,
	SortableTableHeader,
	AbstractPageableDataComponent, SortChange
} from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert.module';
import { ExportConfigService } from '../../export-config.service';
import { AdminTopics } from '../../admin/admin.module';

import { FeedbackService } from '../feedback.service';

@Component({
	templateUrl: 'admin-list-feedback.component.html'
})
export class AdminListFeedbackComponent extends AbstractPageableDataComponent<any> implements OnInit {

	headers: SortableTableHeader[] = [
		{ name: 'Submitted By', sortable: true, sortField: 'audit.actor', sortDir: SortDirection.asc },
		{ name: 'Email', sortable: false },
		{ name: 'Type', sortable: true, sortField: 'type', sortDir: SortDirection.asc },
		{ name: 'Feedback', sortable: false },
		{ name: 'Submitted From', sortable: true, sortField: 'url', sortDir: SortDirection.asc },
		{ name: 'Browser', sortable: true, sortField: 'browser', sortDir: SortDirection.asc },
		{ name: 'OS', sortable: true, sortField: 'os', sortDir: SortDirection.asc },
		{ name: 'Submission Time', sortable: true, sortField: 'created', sortDir: SortDirection.desc, default: true }
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

		this.sortEvent$.next(this.headers.find((header: any) => header.default) as SortChange);

		super.ngOnInit();
	}

	export() {
		this.exportConfigService
			.postExportConfig('feedback', { sort: this.pagingOptions.sortField, dir: this.pagingOptions.sortDir })
			.subscribe((response: any) => {
				window.open(`/api/admin/feedback/csv/${response._id}`);
			});
	}

	loadData(pagingOptions: PagingOptions, search: string, query: any): Observable<PagingResults<any>> {
		return this.feedbackService.getFeedback(pagingOptions, query, search, {});
	}
}

AdminTopics.registerTopic({
	id: 'feedback',
	title: 'Feedback',
	ordinal: 4,
	path: 'feedback'
});

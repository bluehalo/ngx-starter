import { Component, OnInit } from '@angular/core';

import {
	AbstractPageableDataComponent,
	PagingOptions,
	PagingResults,
	SortableTableHeader,
	SortChange,
	SortDirection
} from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert.module';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { ExportConfigService } from '../../export-config.service';
import { FeedbackService } from '../../feedback/feedback.service';

@UntilDestroy()
@Component({
	templateUrl: 'admin-list-feedback.component.html'
})
export class AdminListFeedbackComponent extends AbstractPageableDataComponent<any>
	implements OnInit {
	headers: SortableTableHeader[] = [
		{
			name: 'Submitted By',
			sortable: false
		},
		{ name: 'Email', sortable: false },
		{
			name: 'Submitted Date',
			sortable: true,
			sortField: 'created',
			sortDir: SortDirection.asc,
			default: true
		},
		{ name: 'Type', sortable: true, sortField: 'type', sortDir: SortDirection.asc },
		{ name: 'Feedback', sortable: false },
		{ name: 'Browser', sortable: true, sortField: 'browser', sortDir: SortDirection.asc },
		{ name: 'OS', sortable: true, sortField: 'os', sortDir: SortDirection.asc },
		{ name: 'Submitted From', sortable: true, sortField: 'url', sortDir: SortDirection.asc }
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
			.postExportConfig('feedback', {
				sort: this.pagingOptions.sortField,
				dir: this.pagingOptions.sortDir
			})
			.pipe(untilDestroyed(this))
			.subscribe((response: any) => {
				window.open(`/api/admin/feedback/csv/${response._id}`);
			});
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<any>> {
		return this.feedbackService.getFeedback(pagingOptions, query, search, {});
	}
}

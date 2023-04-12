import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

import { PagingOptions, PagingResults } from '../../../../common/paging.model';
import { SortDirection } from '../../../../common/sorting.model';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { AsyTableDataSource } from '../../../../common/table/asy-table-data-source';
import { ExportConfigService } from '../../../export-config.service';
import { Feedback, FeedbackStatusOption } from '../../../feedback/feedback.model';
import { FeedbackService } from '../../../feedback/feedback.service';
import { AdminUsersService } from '../../user-management/admin-users.service';

@UntilDestroy()
@Component({
	templateUrl: 'admin-list-feedback.component.html',
	styleUrls: ['admin-list-feedback.component.scss']
})
export class AdminListFeedbackComponent implements OnDestroy, OnInit {
	feedbackStatusOptions = FeedbackStatusOption;

	assigneeUsernames: string[] = [];

	columns = [
		{
			key: 'creator.name',
			label: 'Submitted By',
			selected: true
		},
		{
			key: 'creator.username',
			label: 'Username',
			selected: false
		},
		{
			key: 'creator.email',
			label: 'Email',
			selected: false
		},
		{
			key: 'creator.organization',
			label: 'Organization',
			selected: false
		},
		{ key: 'created', label: 'Submitted Date', selected: true },
		{
			key: 'type',
			label: 'Type',
			selected: false
		},
		{ key: 'body', label: 'Feedback', selected: true },
		{ key: 'status', label: 'Status', selected: true },
		{
			key: 'assignee',
			label: 'Assignee',
			selected: true
		},
		{
			key: 'updated',
			label: 'Updated',
			selected: false
		},
		{
			key: 'browser',
			label: 'Browser',
			selected: false
		},
		{
			key: 'os',
			label: 'OS',
			selected: false
		},
		{
			key: 'url',
			label: 'Submitted From',
			selected: false
		}
	];
	displayedColumns: string[] = [];

	dataSource = new AsyTableDataSource<Feedback>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		'admin-list-feedback-component',
		{
			sortField: 'created',
			sortDir: SortDirection.desc
		}
	);

	constructor(
		private feedbackService: FeedbackService,
		private exportConfigService: ExportConfigService,
		private alertService: SystemAlertService,
		private adminUsersService: AdminUsersService
	) {
		this.adminUsersService
			.getAll({ 'roles.admin': true }, 'username')
			.pipe(untilDestroyed(this))
			.subscribe({
				next: (usernames) => {
					this.assigneeUsernames = usernames as string[];
				}
			});
	}

	ngOnInit() {
		this.alertService.clearAllAlerts();
		this.columnsChanged(this.columns.filter((c) => c.selected).map((c) => c.key));
	}

	ngOnDestroy() {
		this.dataSource.disconnect();
	}

	columnsChanged(columns: string[]) {
		setTimeout(() => {
			this.displayedColumns = [...columns];
		});
	}

	clearFilters() {
		this.dataSource.search('');
	}

	exportCurrentView() {
		const viewColumns = this.columns
			.filter((column) => this.displayedColumns.includes(column.key))
			.map((column) => ({ key: column.key, title: column.label }));

		this.exportConfigService
			.postExportConfig('feedback', {
				q: this.dataSource.filterEvent$.value,
				s: this.dataSource.searchEvent$.value,
				sort: this.dataSource.sortEvent$.value.sortField,
				dir: this.dataSource.sortEvent$.value.sortDir,
				cols: viewColumns
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
	): Observable<PagingResults<Feedback>> {
		return this.feedbackService.search(pagingOptions, query, search);
	}

	updateFeedbackAssignee(feedback: Feedback, assignee: string | null = null) {
		this.feedbackService
			.updateFeedbackAssignee(feedback._id, assignee)
			.pipe(untilDestroyed(this))
			.subscribe({
				next: (updatedFeedback) => {
					this.dataSource.reload();
				},
				error: (error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.alertService.addAlert(error.error.message);
					}
				}
			});
	}

	updateFeedbackStatus(feedback: Feedback, status: FeedbackStatusOption) {
		this.feedbackService
			.updateFeedbackStatus(feedback._id, status)
			.pipe(untilDestroyed(this))
			.subscribe({
				next: (updatedFeedback) => {
					this.dataSource.reload();
				},
				error: (error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.alertService.addAlert(error.error.message);
					}
				}
			});
	}
}

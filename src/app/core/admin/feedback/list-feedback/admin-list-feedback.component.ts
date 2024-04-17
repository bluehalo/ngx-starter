import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import { NgClass, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable } from 'rxjs';

import { SkipToDirective } from '../../../../common/directives/skip-to.directive';
import { PagingOptions, PagingResults } from '../../../../common/paging.model';
import { SearchInputComponent } from '../../../../common/search-input/search-input.component';
import { SortDirection } from '../../../../common/sorting.model';
import { SystemAlertComponent } from '../../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import {
	AgoDateColumnComponent,
	AsyFilterDirective,
	AsyHeaderListFilterComponent,
	AsySortDirective,
	AsySortHeaderComponent,
	AsyTableDataSource,
	AsyTableEmptyStateComponent,
	ColumnChooserComponent,
	PaginatorComponent,
	SidebarComponent,
	TextColumnComponent
} from '../../../../common/table';
import { ExportConfigService } from '../../../export-config.service';
import { Feedback, FeedbackStatusOption } from '../../../feedback/feedback.model';
import { FeedbackService } from '../../../feedback/feedback.service';
import { AdminUsersService } from '../../user/admin-users.service';

@Component({
	templateUrl: 'admin-list-feedback.component.html',
	styleUrls: ['admin-list-feedback.component.scss'],
	standalone: true,
	imports: [
		SystemAlertComponent,
		SearchInputComponent,
		TooltipModule,
		CdkTableModule,
		OverlayModule,
		AsySortDirective,
		AsyFilterDirective,
		AsySortHeaderComponent,
		AsyHeaderListFilterComponent,
		AsyTableEmptyStateComponent,
		SidebarComponent,
		ColumnChooserComponent,
		PaginatorComponent,
		TitleCasePipe,
		SkipToDirective,
		NgClass,
		CdkMenuTrigger,
		CdkMenu,
		CdkMenuItem,
		AgoDateColumnComponent,
		TextColumnComponent
	]
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

	private destroyRef = inject(DestroyRef);
	private feedbackService = inject(FeedbackService);
	private exportConfigService = inject(ExportConfigService);
	private alertService = inject(SystemAlertService);
	private adminUsersService = inject(AdminUsersService);

	constructor() {
		this.adminUsersService
			.getAll({ 'roles.admin': true }, 'username')
			.pipe(takeUntilDestroyed())
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
			.pipe(takeUntilDestroyed(this.destroyRef))
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
			.pipe(takeUntilDestroyed(this.destroyRef))
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
			.pipe(takeUntilDestroyed(this.destroyRef))
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

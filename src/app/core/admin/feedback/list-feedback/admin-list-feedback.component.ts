import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import { NgClass, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import {
	PagingOptions,
	PagingResults,
	SearchInputComponent,
	SkipToDirective,
	SortDirection
} from '../../../../common';
import { SystemAlertComponent, SystemAlertService } from '../../../../common/system-alert';
import {
	AgoDateColumnComponent,
	AsyFilterDirective,
	AsyHeaderListFilterComponent,
	AsyHeaderSortComponent,
	AsyHeaderTextFilterComponent,
	AsySortDirective,
	AsyTableDataSource,
	AsyTableEmptyStateComponent,
	ColumnChooserComponent,
	PaginatorComponent,
	SidebarComponent,
	TextColumnComponent
} from '../../../../common/table';
import { ExportConfigService } from '../../../export-config.service';
import { Feedback, FeedbackService, FeedbackStatusOption } from '../../../feedback';
import { AdminUsersService } from '../../user/admin-users.service';

@Component({
	templateUrl: './admin-list-feedback.component.html',
	styleUrls: ['./admin-list-feedback.component.scss'],
	standalone: true,
	imports: [
		SystemAlertComponent,
		SearchInputComponent,
		CdkTableModule,
		OverlayModule,
		AsySortDirective,
		AsyFilterDirective,
		AsyHeaderSortComponent,
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
		TextColumnComponent,
		AsyHeaderTextFilterComponent,
		NgbTooltip
	]
})
export class AdminListFeedbackComponent implements OnInit {
	readonly #destroyRef = inject(DestroyRef);
	readonly #feedbackService = inject(FeedbackService);
	readonly #exportConfigService = inject(ExportConfigService);
	readonly #alertService = inject(SystemAlertService);
	readonly #adminUsersService = inject(AdminUsersService);
	readonly feedbackStatusOptions = FeedbackStatusOption;

	readonly displayedColumns = signal<string[]>([]);
	readonly assigneeUsernames = signal<string[]>([]);

	readonly columns = [
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

	readonly dataSource = new AsyTableDataSource<Feedback>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		'admin-list-feedback-component',
		{
			sortField: 'created',
			sortDir: SortDirection.desc
		}
	);

	constructor() {
		this.#adminUsersService
			.getAll({ 'roles.admin': true }, 'username')
			.pipe(takeUntilDestroyed())
			.subscribe({
				next: (usernames) => {
					this.assigneeUsernames.set(usernames as string[]);
				}
			});
	}

	ngOnInit() {
		this.#alertService.clearAllAlerts();
		this.columnsChanged(this.columns.filter((c) => c.selected).map((c) => c.key));
	}

	columnsChanged(columns: string[]) {
		setTimeout(() => {
			this.displayedColumns.set([...columns]);
		});
	}

	clearFilters() {
		this.dataSource.search('');
	}

	exportCurrentView() {
		const viewColumns = this.columns
			.filter((column) => this.displayedColumns().includes(column.key))
			.map((column) => ({ key: column.key, title: column.label }));

		this.#exportConfigService
			.postExportConfig('feedback', {
				q: this.dataSource.filterEvent$.value,
				s: this.dataSource.searchEvent$.value,
				sort: this.dataSource.sortEvent$.value.sortField,
				dir: this.dataSource.sortEvent$.value.sortDir,
				cols: viewColumns
			})
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((response: any) => {
				window.open(`/api/admin/feedback/csv/${response._id}`);
			});
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<Feedback>> {
		return this.#feedbackService.search(pagingOptions, query, search);
	}

	updateFeedbackAssignee(feedback: Feedback, assignee: string | null = null) {
		this.#feedbackService
			.updateFeedbackAssignee(feedback._id, assignee)
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe({
				next: () => {
					this.dataSource.reload();
				},
				error: (error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.#alertService.addAlert(error.error.message);
					}
				}
			});
	}

	updateFeedbackStatus(feedback: Feedback, status: FeedbackStatusOption) {
		this.#feedbackService
			.updateFeedbackStatus(feedback._id, status)
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe({
				next: () => {
					this.dataSource.reload();
				},
				error: (error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.#alertService.addAlert(error.error.message);
					}
				}
			});
	}
}

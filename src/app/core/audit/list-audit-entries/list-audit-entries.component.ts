import { ComponentType, OverlayModule } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import { JsonPipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	signal,
	viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { PagingOptions, PagingResults, SkipToDirective } from '../../../common';
import { DialogService } from '../../../common/dialog';
import { UtcDatePipe } from '../../../common/pipes';
import { SystemAlertComponent, SystemAlertService } from '../../../common/system-alert';
import {
	AsyFilterDirective,
	AsyHeaderDateFilterComponent,
	AsyHeaderListFilterComponent,
	AsyHeaderSortComponent,
	AsyHeaderTypeaheadFilterComponent,
	AsySortDirective,
	AsyTableDataSource,
	AsyTableEmptyStateComponent,
	PaginatorComponent
} from '../../../common/table';
import { ExportConfigService } from '../../export-config.service';
import { APP_CONFIG } from '../../tokens';
import { AuditEntry } from '../audit-entry.model';
import { AuditViewChangeModalComponent } from '../audit-view-change-modal/audit-view-change-modal.component';
import { AuditViewDetailsModalComponent } from '../audit-view-details-modal/audit-view-details-modal.component';
import { AuditService } from '../audit.service';
import { AuditActorFilterDirective } from './audit-actor-filter.directive';
import { AuditDistinctValueFilterDirective } from './audit-distinct-value-filter.directive';

@Component({
	templateUrl: './list-audit-entries.component.html',
	styleUrls: ['./list-audit-entries.component.scss'],
	standalone: true,
	imports: [
		SkipToDirective,
		SystemAlertComponent,
		CdkTableModule,
		OverlayModule,
		AsySortDirective,
		AsyFilterDirective,
		AsyHeaderSortComponent,
		AsyHeaderTypeaheadFilterComponent,
		AuditActorFilterDirective,
		AsyHeaderDateFilterComponent,
		AsyHeaderListFilterComponent,
		AuditDistinctValueFilterDirective,
		AsyTableEmptyStateComponent,
		PaginatorComponent,
		UtcDatePipe,
		NgbTooltip,
		JsonPipe
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListAuditEntriesComponent {
	readonly #destroyRef = inject(DestroyRef);
	readonly #dialogService = inject(DialogService);
	readonly #alertService = inject(SystemAlertService);
	readonly #auditService = inject(AuditService);
	readonly #exportConfigService = inject(ExportConfigService);
	readonly #config = inject(APP_CONFIG);

	readonly filter = viewChild.required(AsyFilterDirective);

	readonly #columns = [
		{
			key: 'audit.actor',
			label: 'Actor',
			selected: true
		},
		{
			key: 'created',
			label: 'Timestamp',
			selected: true
		},
		{
			key: 'audit.action',
			label: 'Action',
			selected: true
		},
		{
			key: 'audit.auditType',
			label: 'Type',
			selected: true
		},
		{
			key: 'audit.object',
			label: 'Object',
			selected: true
		},
		{
			key: 'before',
			label: 'Before',
			selected: true
		},
		{
			key: 'message',
			label: 'Message',
			selected: true
		},
		{
			key: 'audit.masqueradingUser',
			label: 'Masquerading User'
		}
	];

	readonly displayedColumns = signal([
		'audit.actor',
		'created',
		'audit.action',
		'audit.auditType',
		'audit.object',
		'before',
		'message'
	]);

	readonly dataSource = new AsyTableDataSource<AuditEntry>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		'list-audit-entries-component',
		{
			sortField: 'created',
			sortDir: 'DESC'
		}
	);

	constructor() {
		this.#alertService.clearAllAlerts();

		if (this.#config()?.masqueradeEnabled) {
			this.displayedColumns.update((cols) => [...cols, 'audit.masqueradingUser']);
		}
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: object
	): Observable<PagingResults<AuditEntry>> {
		return this.#auditService.search(pagingOptions, query, search);
	}

	exportCurrentView() {
		const viewColumns = this.#columns
			.filter((column) => this.displayedColumns().includes(column.key))
			.map((column) => ({ key: column.key, title: column.label }));

		this.#exportConfigService
			.postExportConfig('audit', {
				q: this.dataSource.filterEvent$.value,
				s: this.dataSource.searchEvent$.value,
				sort: this.dataSource.sortEvent$.value.sortField,
				dir: this.dataSource.sortEvent$.value.sortDir,
				cols: viewColumns
			})
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((response) => {
				window.open(`/api/audit/csv/${response._id}`);
			});
	}

	clearFilters() {
		this.dataSource.search('');
		this.filter().clearFilter();
	}

	viewComponents = new Map<string, ComponentType<unknown>>([
		['viewDetails', AuditViewDetailsModalComponent],
		['viewChanges', AuditViewChangeModalComponent]
	]);

	viewMore(auditEntry: unknown, type: string) {
		const component = this.viewComponents.get(type);
		if (component) {
			this.#dialogService.open(component, {
				data: {
					auditEntry
				}
			});
		}
	}
}

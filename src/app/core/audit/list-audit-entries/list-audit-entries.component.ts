import { ComponentType, OverlayModule } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	signal,
	viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable } from 'rxjs';

import { DialogService } from '../../../common/dialog';
import { SkipToDirective } from '../../../common/directives/skip-to.directive';
import { PagingOptions, PagingResults } from '../../../common/paging.model';
import { UtcDatePipe } from '../../../common/pipes/utc-date-pipe/utc-date.pipe';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import {
	AsyFilterDirective,
	AsyHeaderDateFilterComponent,
	AsyHeaderListFilterComponent,
	AsyHeaderTypeaheadFilterComponent,
	AsySortDirective,
	AsySortHeaderComponent,
	AsyTableDataSource,
	AsyTableEmptyStateComponent,
	PaginatorComponent
} from '../../../common/table';
import { ExportConfigService } from '../../export-config.service';
import { APP_CONFIG } from '../../tokens';
import { AuditObjectComponent } from '../audit-object.component';
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
		AsySortHeaderComponent,
		AsyHeaderTypeaheadFilterComponent,
		AuditActorFilterDirective,
		AuditObjectComponent,
		AsyHeaderDateFilterComponent,
		AsyHeaderListFilterComponent,
		AuditDistinctValueFilterDirective,
		TooltipModule,
		AsyTableEmptyStateComponent,
		PaginatorComponent,
		UtcDatePipe
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

	readonly dataSource = new AsyTableDataSource(
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

	loadData(pagingOptions: PagingOptions, search: string, query: any): Observable<PagingResults> {
		return this.#auditService.search(query, search, pagingOptions);
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
			.subscribe((response: any) => {
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

	viewMore(auditEntry: any, type: string) {
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

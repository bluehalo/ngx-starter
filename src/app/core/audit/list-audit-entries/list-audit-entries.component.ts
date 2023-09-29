import { ComponentType, OverlayModule } from '@angular/cdk/overlay';
import { CdkTableModule } from '@angular/cdk/table';
import { NgIf } from '@angular/common';
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { DialogService } from '../../../common/dialog';
import { SkipToDirective } from '../../../common/directives/skip-to.directive';
import { PagingOptions, PagingResults } from '../../../common/paging.model';
import { UtcDatePipe } from '../../../common/pipes/utc-date-pipe/utc-date.pipe';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { AsyTableDataSource } from '../../../common/table/asy-table-data-source';
import { AsyFilterDirective } from '../../../common/table/filter/asy-filter.directive';
import { AsyHeaderDateFilterComponent } from '../../../common/table/filter/asy-header-date-filter/asy-header-date-filter.component';
import { AsyHeaderListFilterComponent } from '../../../common/table/filter/asy-header-list-filter/asy-header-list-filter.component';
import { AsyHeaderTypeaheadFilterComponent } from '../../../common/table/filter/asy-header-typeahead-filter/asy-header-typeahead-filter.component';
import { PaginatorComponent } from '../../../common/table/paginator/paginator.component';
import { AsySortHeaderComponent } from '../../../common/table/sort/asy-sort-header/asy-sort-header.component';
import { AsySortDirective } from '../../../common/table/sort/asy-sort.directive';
import { AsyTableEmptyStateComponent } from '../../../common/table/table-empty-state/asy-table-empty-state.component';
import { ConfigService } from '../../config.service';
import { ExportConfigService } from '../../export-config.service';
import { AuditObjectComponent } from '../audit-object.component';
import { AuditViewChangeModalComponent } from '../audit-view-change-modal/audit-view-change-modal.component';
import { AuditViewDetailsModalComponent } from '../audit-view-details-modal/audit-view-details-modal.component';
import { AuditService } from '../audit.service';
import { AuditActorFilterDirective } from './audit-actor-filter.directive';
import { AuditDistinctValueFilterDirective } from './audit-distinct-value-filter.directive';

@UntilDestroy()
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
		NgIf,
		TooltipModule,
		AsyTableEmptyStateComponent,
		PaginatorComponent,
		UtcDatePipe
	]
})
export class ListAuditEntriesComponent implements OnDestroy {
	@ViewChild(AsyFilterDirective)
	filter: AsyFilterDirective;

	columns = [
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

	displayedColumns = [
		'audit.actor',
		'created',
		'audit.action',
		'audit.auditType',
		'audit.object',
		'before',
		'message'
	];

	dataSource = new AsyTableDataSource(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		'list-audit-entries-component',
		{
			sortField: 'created',
			sortDir: 'DESC'
		}
	);

	private dialogService = inject(DialogService);

	constructor(
		private alertService: SystemAlertService,
		private auditService: AuditService,
		private configService: ConfigService,
		private exportConfigService: ExportConfigService
	) {
		this.alertService.clearAllAlerts();
		this.configService
			.getConfig()
			.pipe(first(), untilDestroyed(this))
			.subscribe((config) => {
				if (config?.masqueradeEnabled) {
					this.displayedColumns.push('audit.masqueradingUser');
				}
			});
	}

	ngOnDestroy() {
		this.dataSource.disconnect();
	}

	loadData(pagingOptions: PagingOptions, search: string, query: any): Observable<PagingResults> {
		return this.auditService.search(query, search, pagingOptions);
	}

	exportCurrentView() {
		const viewColumns = this.columns
			.filter((column) => this.displayedColumns.includes(column.key))
			.map((column) => ({ key: column.key, title: column.label }));

		this.exportConfigService
			.postExportConfig('audit', {
				q: this.dataSource.filterEvent$.value,
				s: this.dataSource.searchEvent$.value,
				sort: this.dataSource.sortEvent$.value.sortField,
				dir: this.dataSource.sortEvent$.value.sortDir,
				cols: viewColumns
			})
			.pipe(untilDestroyed(this))
			.subscribe((response: any) => {
				window.open(`/api/audit/csv/${response._id}`);
			});
	}

	clearFilters() {
		this.dataSource.search('');
		this.filter.clearFilter();
	}

	viewComponents = new Map<string, ComponentType<unknown>>([
		['viewDetails', AuditViewDetailsModalComponent],
		['viewChanges', AuditViewChangeModalComponent]
	]);

	viewMore(auditEntry: any, type: string) {
		const component = this.viewComponents.get(type);
		if (component) {
			this.dialogService.open(component, {
				data: {
					auditEntry
				}
			});
		}
	}
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';

import { ModalAction } from '../../../../common/modal/modal.model';
import { ModalService } from '../../../../common/modal/modal.service';
import { PagingOptions, PagingResults } from '../../../../common/paging.model';
import { SortDirection } from '../../../../common/sorting.model';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { AsyTableDataSource } from '../../../../common/table/asy-table-data-source';
import { EndUserAgreement } from '../eua.model';
import { EuaService } from '../eua.service';

@UntilDestroy()
@Component({
	templateUrl: './admin-list-euas.component.html',
	styleUrls: ['./admin-list-euas.component.scss']
})
export class AdminListEuasComponent implements OnDestroy, OnInit {
	columns = [
		{
			key: 'id',
			label: 'ID',
			selected: false
		},
		{
			key: 'title',
			label: 'Title',
			selected: true
		},
		{
			key: 'text',
			label: 'Text',
			selected: false
		},
		{
			key: 'created',
			label: 'Created',
			selected: true
		},
		{
			key: 'published',
			label: 'Published',
			selected: true
		},
		{
			key: 'updated',
			label: 'Updated',
			selected: true
		}
	];
	displayedColumns: string[] = [];

	dataSource = new AsyTableDataSource<EndUserAgreement>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		'admin-list-euas-component',
		{
			sortField: 'displayName',
			sortDir: SortDirection.asc
		}
	);

	constructor(
		private modalService: ModalService,
		private euaService: EuaService,
		private route: ActivatedRoute,
		private alertService: SystemAlertService
	) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();
		this.columnsChanged(this.columns.filter((c) => c.selected).map((c) => c.key));
	}

	ngOnDestroy() {
		this.dataSource.disconnect();
	}

	columnsChanged(columns: string[]) {
		this.displayedColumns = [...columns, 'actionsMenu'];
	}

	clearFilters() {
		this.dataSource.search('');
	}

	confirmDeleteEua(eua: EndUserAgreement) {
		this.modalService
			.confirm(
				'Delete End User Agreement?',
				`Are you sure you want to delete eua: "${eua.title}" ?`,
				'Delete'
			)
			.pipe(
				first(),
				filter((action) => action === ModalAction.OK),
				switchMap(() => this.euaService.delete(eua)),
				untilDestroyed(this)
			)
			.subscribe(() => {
				this.alertService.addAlert(`Deleted EUA entitled: ${eua.title}`, 'success');
				this.dataSource.reload();
			});
	}

	publishEua(eua: EndUserAgreement) {
		this.euaService
			.publish(eua)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.alertService.addAlert(`Published ${eua.title}`, 'success');
				this.dataSource.reload();
			});
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<EndUserAgreement>> {
		return this.euaService.search(pagingOptions, query, search);
	}

	/**
	 * Opens a preview modal containing the text and title of this end user agreement.
	 *
	 * @param endUserAgreement - the end user agreement used to populate the modal
	 */
	previewEndUserAgreement(endUserAgreement: any) {
		const { text, title } = endUserAgreement;
		this.modalService.alert(title, text);
	}
}

import { CdkTableModule } from '@angular/cdk/table';
import { NgIf } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { SkipToDirective } from '../../../common/directives/skip-to.directive';
import { AgoDatePipe } from '../../../common/pipes/ago-date.pipe';
import { UtcDatePipe } from '../../../common/pipes/utc-date-pipe/utc-date.pipe';
import { SearchInputComponent } from '../../../common/search-input/search-input.component';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { AsyTableDataSource } from '../../../common/table/asy-table-data-source';
import { AsyFilterDirective } from '../../../common/table/filter/asy-filter.directive';
import { PaginatorComponent } from '../../../common/table/paginator/paginator.component';
import { AsySortHeaderComponent } from '../../../common/table/sort/asy-sort-header/asy-sort-header.component';
import { AsySortDirective } from '../../../common/table/sort/asy-sort.directive';
import { AsyTableEmptyStateComponent } from '../../../common/table/table-empty-state/asy-table-empty-state.component';
import { Team } from '../team.model';
import { BaseListTeamsComponent } from './base-list-teams.component';

@Component({
	selector: 'app-list-sub-teams',
	templateUrl: './list-teams.component.html',
	styleUrls: ['./list-teams.component.scss'],
	standalone: true,
	imports: [
		NgIf,
		SkipToDirective,
		SystemAlertComponent,
		SearchInputComponent,
		RouterLink,
		CdkTableModule,
		AsySortDirective,
		AsyFilterDirective,
		AsySortHeaderComponent,
		TooltipModule,
		AsyTableEmptyStateComponent,
		PaginatorComponent,
		AgoDatePipe,
		UtcDatePipe
	]
})
export class ListSubTeamsComponent
	extends BaseListTeamsComponent
	implements OnChanges, OnDestroy, OnInit
{
	constructor() {
		super(
			new AsyTableDataSource<Team>(
				(request) => this.loadData(request.pagingOptions, request.search, request.filter),
				'list-sub-teams-component',
				{
					sortField: 'name',
					sortDir: 'ASC'
				}
			)
		);
	}
}

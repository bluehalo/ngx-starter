import { CdkTableModule } from '@angular/cdk/table';
import { NgIf } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { SkipToDirective } from '../../../common/directives/skip-to.directive';
import { SearchInputComponent } from '../../../common/search-input/search-input.component';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import {
	AgoDateColumnComponent,
	AsyFilterDirective,
	AsySortDirective,
	AsySortHeaderComponent,
	AsyTableDataSource,
	AsyTableEmptyStateComponent,
	PaginatorComponent
} from '../../../common/table';
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
		AgoDateColumnComponent
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

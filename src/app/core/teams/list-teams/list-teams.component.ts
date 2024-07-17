import { CdkTableModule } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SearchInputComponent, SkipToDirective } from '../../../common';
import { SystemAlertComponent } from '../../../common/system-alert';
import {
	AgoDateColumnComponent,
	AsyFilterDirective,
	AsyHeaderSortComponent,
	AsySortDirective,
	AsyTableDataSource,
	AsyTableEmptyStateComponent,
	DateColumnComponent,
	PaginatorComponent
} from '../../../common/table';
import { Team } from '../team.model';
import { BaseListTeamsComponent } from './base-list-teams.component';

@Component({
	templateUrl: './list-teams.component.html',
	styleUrls: ['./list-teams.component.scss'],
	standalone: true,
	imports: [
		SkipToDirective,
		SystemAlertComponent,
		SearchInputComponent,
		RouterLink,
		CdkTableModule,
		AsySortDirective,
		AsyFilterDirective,
		AsyHeaderSortComponent,
		AsyTableEmptyStateComponent,
		PaginatorComponent,
		AgoDateColumnComponent,
		DateColumnComponent
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTeamsComponent extends BaseListTeamsComponent {
	constructor() {
		super(
			new AsyTableDataSource<Team>(
				(request) => this.loadData(request.pagingOptions, request.search, request.filter),
				'list-teams-component',
				{
					sortField: 'name',
					sortDir: 'ASC'
				}
			)
		);
	}
}

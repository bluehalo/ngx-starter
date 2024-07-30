import { CdkTableModule } from '@angular/cdk/table';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { explicitEffect } from 'ngxtension/explicit-effect';

import { SearchInputComponent, SkipToDirective } from '../../../common';
import { SystemAlertComponent } from '../../../common/system-alert';
import {
	AgoDateColumnComponent,
	AsyFilterDirective,
	AsyHeaderSortComponent,
	AsySortDirective,
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
		AsyHeaderSortComponent,
		AsyTableEmptyStateComponent,
		PaginatorComponent,
		AgoDateColumnComponent
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListSubTeamsComponent extends BaseListTeamsComponent {
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

		explicitEffect([this.parent], () => {
			this.dataSource.reload();
		});
	}
}

import { CdkTableModule } from '@angular/cdk/table';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
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

		// eslint-disable-next-line rxjs-angular/prefer-takeuntil
		toObservable(this.parent).subscribe(() => {
			this.dataSource.reload();
		});
	}
}

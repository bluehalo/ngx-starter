import { Component, OnInit } from '@angular/core';

import {
	AbstractPageableDataComponent,
	PagingOptions,
	PagingResults,
	SortableTableHeader,
	SortChange,
	SortDirection
} from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert.module';

import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../../auth/authorization.service';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@UntilDestroy()
@Component({
	templateUrl: './list-teams.component.html'
})
export class ListTeamsComponent extends AbstractPageableDataComponent<Team> implements OnInit {
	canCreateTeam = false;

	headers: SortableTableHeader[] = [
		{
			name: 'Name',
			sortable: true,
			sortField: 'name',
			sortDir: SortDirection.asc,
			tooltip: 'Sort by Team Name',
			default: true
		},
		{
			name: 'Created',
			sortable: true,
			sortField: 'created',
			sortDir: SortDirection.desc,
			tooltip: 'Sort by Created'
		},
		{
			name: 'Description',
			sortable: true,
			sortField: 'description',
			sortDir: SortDirection.desc,
			tooltip: 'Sort by Description'
		}
	];

	constructor(
		private teamsService: TeamsService,
		private alertService: SystemAlertService,
		private authorizationService: AuthorizationService
	) {
		super();
	}

	ngOnInit() {
		this.alertService.clearAllAlerts();

		this.sortEvent$.next(this.headers.find((header: any) => header.default) as SortChange);

		this.canCreateTeam = this.authorizationService.hasSomeRoles(['editor', 'admin']);

		super.ngOnInit();
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<Team>> {
		return this.teamsService.search(pagingOptions, query, search, {});
	}
}

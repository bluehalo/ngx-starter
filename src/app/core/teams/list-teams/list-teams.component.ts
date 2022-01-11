import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import cloneDeep from 'lodash/cloneDeep';
import { Observable } from 'rxjs';

import {
	AbstractPageableDataComponent,
	PagingOptions,
	PagingResults,
	SortableTableHeader,
	SortChange,
	SortDirection
} from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert.module';
import { AuthorizationService } from '../../auth/authorization.service';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@UntilDestroy()
@Component({
	selector: 'app-list-teams',
	templateUrl: './list-teams.component.html'
})
export class ListTeamsComponent
	extends AbstractPageableDataComponent<Team>
	implements OnChanges, OnInit
{
	@Input()
	parent?: Team;

	@Input()
	embedded = false;

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

	ngOnChanges(changes: SimpleChanges) {
		if (changes.parent) {
			this.load$.next(true);
		}
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<Team>> {
		if (this.parent) {
			query = cloneDeep(query);
			if (!query.$and) {
				query.$and = [];
			}
			query.$and.push({ parent: this.parent._id });
		}

		return this.teamsService.search(pagingOptions, query, search, {});
	}
}

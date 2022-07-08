import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { Observable } from 'rxjs';

import { PagingOptions, PagingResults } from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { AsyTableDataSource } from '../../../common/table/asy-table-data-source';
import { AuthorizationService } from '../../auth/authorization.service';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@Component({
	selector: 'app-list-teams',
	templateUrl: './list-teams.component.html',
	styleUrls: ['./list-teams.component.scss']
})
export class ListTeamsComponent implements OnChanges, OnDestroy, OnInit {
	@Input()
	parent?: Team;

	@Input()
	embedded = false;

	canCreateTeam = false;

	displayedColumns = ['name', 'created', 'description'];

	dataSource = new AsyTableDataSource<Team>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		'list-teams-component',
		{
			sortField: 'name',
			sortDir: 'ASC'
		}
	);

	constructor(
		private teamsService: TeamsService,
		private alertService: SystemAlertService,
		private authorizationService: AuthorizationService
	) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();

		this.canCreateTeam = this.authorizationService.hasSomeRoles(['editor', 'admin']);
	}

	ngOnDestroy() {
		this.dataSource.disconnect();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['parent']) {
			this.dataSource.reload();
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

	clearFilters() {
		this.dataSource.search('');
	}
}

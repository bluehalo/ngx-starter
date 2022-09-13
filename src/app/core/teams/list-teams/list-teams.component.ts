import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { AsyTableDataSource } from '../../../common/table/asy-table-data-source';
import { Team } from '../team.model';
import { BaseListTeamsComponent } from './base-list-teams.component';

@Component({
	templateUrl: './list-teams.component.html',
	styleUrls: ['./list-teams.component.scss']
})
export class ListTeamsComponent
	extends BaseListTeamsComponent
	implements OnChanges, OnDestroy, OnInit
{
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

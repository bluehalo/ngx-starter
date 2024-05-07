import {
	Directive,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges,
	booleanAttribute,
	inject
} from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { Observable } from 'rxjs';

import { PagingOptions, PagingResults } from '../../../common/paging.model';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { AsyTableDataSource } from '../../../common/table';
import { APP_SESSION } from '../../tokens';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@Directive()
export abstract class BaseListTeamsComponent implements OnChanges, OnDestroy, OnInit {
	@Input()
	parent?: Team;

	@Input({ transform: booleanAttribute })
	embedded = false;

	canCreateTeam = false;

	displayedColumns = ['name', 'created', 'description'];

	teamsService = inject(TeamsService);
	alertService = inject(SystemAlertService);
	#session = inject(APP_SESSION);

	protected constructor(public dataSource: AsyTableDataSource<Team>) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();
		this.canCreateTeam = this.#session().hasSomeRoles(['editor', 'admin']);
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

		return this.teamsService.search(pagingOptions, query, search);
	}

	clearFilters() {
		this.dataSource.search('');
	}
}

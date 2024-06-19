import {
	Directive,
	HostAttributeToken,
	booleanAttribute,
	computed,
	inject,
	input
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
export abstract class BaseListTeamsComponent {
	readonly #teamsService = inject(TeamsService);
	readonly #alertService = inject(SystemAlertService);
	readonly #session = inject(APP_SESSION);

	readonly parent = input<Team>();
	readonly embedded = booleanAttribute(
		inject(new HostAttributeToken('embedded'), { optional: true })
	);

	readonly canCreateTeam = computed(() => this.#session().hasSomeRoles(['editor', 'admin']));

	readonly displayedColumns = ['name', 'created', 'description'];

	protected constructor(public dataSource: AsyTableDataSource<Team>) {
		this.#alertService.clearAllAlerts();
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<Team>> {
		if (this.parent()) {
			query = cloneDeep(query);
			if (!query.$and) {
				query.$and = [];
			}
			query.$and.push({ parent: this.parent()?._id });
		}

		return this.#teamsService.search(pagingOptions, query, search);
	}

	clearFilters() {
		this.dataSource.search('');
	}
}

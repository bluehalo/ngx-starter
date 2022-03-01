import { Directive, OnInit } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';

import {
	AsyHeaderListFilterComponent,
	ListFilterOption
} from '../../../common/table/filter/asy-header-list-filter/asy-header-list-filter.component';
import { ConfigService } from '../../config.service';
import { TeamRole } from '../team-role.model';

@UntilDestroy()
@Directive({
	selector: 'asy-header-filter[list-filter][team-role-filter]'
})
export class TeamRoleFilterDirective implements OnInit {
	constructor(
		private listFilter: AsyHeaderListFilterComponent,
		private configService: ConfigService
	) {}

	ngOnInit() {
		this.listFilter.options = [
			...TeamRole.ROLES.map(
				(role) =>
					({
						display: role.label,
						value: role.role
					} as ListFilterOption)
			)
		];

		this.listFilter.buildFilterFunc = this.buildFilter.bind(this);
	}

	buildFilter(options: ListFilterOption[]): any {
		const $or: any[] = options
			.filter((option) => option.active && option.value !== 'pending')
			.map((option) => ({ ['teams.role']: option.value }))
			.filter((query) => query !== undefined);

		return {
			...($or.length > 0 && { $or })
		};
	}
}

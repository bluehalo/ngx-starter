import { Directive, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { first } from 'rxjs/operators';

import {
	AsyHeaderListFilterComponent,
	ListFilterOption
} from '../../../../common/table/filter/asy-header-list-filter/asy-header-list-filter.component';
import { Role } from '../../../auth/role.model';
import { ConfigService } from '../../../config.service';

@UntilDestroy()
@Directive({
	selector: 'asy-header-filter[list-filter][user-role-filter]',
	standalone: true
})
export class UserRoleFilterDirective implements OnInit {
	private requiredExternalRoles: string[] = [];

	constructor(
		private listFilter: AsyHeaderListFilterComponent,
		private configService: ConfigService
	) {}

	ngOnInit() {
		this.listFilter.options = [
			...Role.ROLES.map(
				(role) =>
					({
						display: role.label,
						value: role.role
					} as ListFilterOption)
			),
			'pending'
		];
		this.listFilter.buildFilterFunc = this.buildFilter.bind(this);

		this.configService
			.getConfig()
			.pipe(first(), untilDestroyed(this))
			.subscribe((config: any) => {
				this.requiredExternalRoles = Array.isArray(config.requiredRoles)
					? config.requiredRoles
					: [];
			});
	}

	buildFilter(options: ListFilterOption[]): any {
		const $or: any[] = options
			.filter((option) => option.active && option.value !== 'pending')
			.map((option) => ({ [`roles.${option.value}`]: true }))
			.filter((query) => query !== undefined);

		if (options.find((option) => option.active && option.value === 'pending')) {
			$or.push({ 'roles.user': { $ne: true } });
			if (this.requiredExternalRoles.length > 0) {
				$or.push({
					$and: [
						{ bypassAccessCheck: { $ne: true } },
						{ externalRoles: { $not: { $all: this.requiredExternalRoles } } }
					]
				});
			}
		}

		return {
			...($or.length > 0 && { $or })
		};
	}
}

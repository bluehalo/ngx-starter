import { Directive, OnInit, inject } from '@angular/core';

import { AsyHeaderListFilterComponent, ListFilterOption } from '../../../../common/table';
import { Role } from '../../../auth';
import { APP_CONFIG } from '../../../tokens';

@Directive({
	selector: 'asy-header-filter[list-filter][user-role-filter]',
	standalone: true
})
export class UserRoleFilterDirective implements OnInit {
	readonly #listFilter = inject(AsyHeaderListFilterComponent);
	readonly #config = inject(APP_CONFIG);

	ngOnInit() {
		this.#listFilter.options = [
			...Role.ROLES.map(
				(role) =>
					({
						display: role.label,
						value: role.role
					}) as ListFilterOption
			),
			'pending'
		];
		this.#listFilter.buildFilterFunc = this.buildFilter.bind(this);
	}

	buildFilter(options: ListFilterOption[]): any {
		const $or: any[] = options
			.filter((option) => option.active && option.value !== 'pending')
			.map((option) => ({ [`roles.${option.value}`]: true }))
			.filter((query) => query !== undefined);

		if (options.find((option) => option.active && option.value === 'pending')) {
			const requiredExternalRoles = this.#config()?.requiredRoles ?? [];

			$or.push({ 'roles.user': { $ne: true } });
			if (requiredExternalRoles.length > 0) {
				$or.push({
					$and: [
						{ bypassAccessCheck: { $ne: true } },
						{ externalRoles: { $not: { $all: requiredExternalRoles } } }
					]
				});
			}
		}

		return {
			...($or.length > 0 && { $or })
		};
	}
}

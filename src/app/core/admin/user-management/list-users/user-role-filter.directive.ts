import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { first } from 'rxjs/operators';

import { AsyHeaderListFilterComponent, ListFilterOption } from '../../../../common/table';
import { Role } from '../../../auth/role.model';
import { ConfigService } from '../../../config.service';

@Directive({
	selector: 'asy-header-filter[list-filter][user-role-filter]',
	standalone: true
})
export class UserRoleFilterDirective implements OnInit {
	private requiredExternalRoles: string[] = [];

	private destroyRef = inject(DestroyRef);
	private listFilter = inject(AsyHeaderListFilterComponent);
	private configService = inject(ConfigService);

	ngOnInit() {
		this.listFilter.options = [
			...Role.ROLES.map(
				(role) =>
					({
						display: role.label,
						value: role.role
					}) as ListFilterOption
			),
			'pending'
		];
		this.listFilter.buildFilterFunc = this.buildFilter.bind(this);

		this.configService
			.getConfig()
			.pipe(first(), takeUntilDestroyed(this.destroyRef))
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

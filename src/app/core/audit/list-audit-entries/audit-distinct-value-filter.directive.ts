import { Directive, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs/operators';

import {
	AsyHeaderListFilterComponent,
	ListFilterOption
} from '../../../common/table/filter/asy-header-list-filter/asy-header-list-filter.component';
import { AuditService } from '../audit.service';

@UntilDestroy()
@Directive({
	selector: 'asy-header-filter[list-filter][audit-distinct-value-filter]',
	standalone: true
})
export class AuditDistinctValueFilterDirective implements OnInit {
	constructor(
		private listFilter: AsyHeaderListFilterComponent,
		private auditService: AuditService
	) {}

	ngOnInit() {
		this.listFilter.options = [];
		this.auditService
			.getDistinctAuditValues(this.listFilter.id)
			.pipe(
				map((options: string[]) =>
					options.map(
						(o) =>
							({
								display: o,
								value: o
							} as ListFilterOption)
					)
				),
				untilDestroyed(this)
			)
			.subscribe((types) => {
				this.listFilter.options = types;
			});
	}
}

import { Directive, OnInit } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { map } from 'rxjs/operators';

import { AsyHeaderListFilterComponent, ListFilterOption } from '../../../common/table.module';
import { AuditService } from '../audit.service';

@UntilDestroy()
@Directive({
	selector: 'asy-header-filter[list-filter][audit-distinct-value-filter]'
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
				untilDestroyed(this),
				map((options: string[]) =>
					options.map(
						(o) =>
							({
								display: o,
								value: o
							} as ListFilterOption)
					)
				)
			)
			.subscribe((types) => {
				this.listFilter.options = types;
			});
	}
}

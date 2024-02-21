import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { map } from 'rxjs/operators';

import { AsyHeaderListFilterComponent, ListFilterOption } from '../../../common/table';
import { AuditService } from '../audit.service';

@Directive({
	selector: 'asy-header-filter[list-filter][audit-distinct-value-filter]',
	standalone: true
})
export class AuditDistinctValueFilterDirective implements OnInit {
	private destroyRef = inject(DestroyRef);
	private listFilter = inject(AsyHeaderListFilterComponent);
	private auditService = inject(AuditService);

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
							}) as ListFilterOption
					)
				),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((types) => {
				this.listFilter.options = types;
			});
	}
}

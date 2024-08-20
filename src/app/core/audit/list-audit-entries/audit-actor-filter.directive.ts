import { Directive, OnInit, inject } from '@angular/core';

import { map } from 'rxjs/operators';

import { PagingOptions } from '../../../common';
import { AsyHeaderTypeaheadFilterComponent } from '../../../common/table';
import { AuditService } from '../audit.service';

@Directive({
	selector: 'asy-header-filter[typeahead-filter][audit-actor-filter]',
	standalone: true
})
export class AuditActorFilterDirective implements OnInit {
	readonly #typeaheadFilter = inject(AsyHeaderTypeaheadFilterComponent);
	readonly #auditService = inject(AuditService);

	ngOnInit() {
		this.#typeaheadFilter.typeaheadFunc = this.typeaheadSearch.bind(this);
		this.#typeaheadFilter.buildFilterFunc = this.buildFilter;
	}

	typeaheadSearch(term: string) {
		return this.#auditService
			.matchUser(new PagingOptions(), {}, term)
			.pipe(map((pagingResult) => pagingResult.elements));
	}

	buildFilter(selectedValue: { _id: unknown }): object {
		if (!selectedValue) {
			return {};
		}
		return {
			['audit.actor._id']: {
				$obj: selectedValue._id
			}
		};
	}
}

import { Directive, OnInit, inject } from '@angular/core';

import { map } from 'rxjs/operators';

import { PagingOptions } from '../../../common/paging.model';
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
			.matchUser({}, term, new PagingOptions(), {})
			.pipe(map((pagingResult) => pagingResult.elements));
	}

	buildFilter(selectedValue: any): any {
		if (selectedValue) {
			return {
				['audit.actor._id']: {
					$obj: selectedValue._id
				}
			};
		}
	}
}

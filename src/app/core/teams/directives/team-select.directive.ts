import { Directive, SimpleChange, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NgSelectComponent } from '@ng-select/ng-select';

import { TeamsService } from '../teams.service';

@Directive({
	selector: 'ng-select[appTeamSelect]',
	standalone: true
})
export class TeamSelectDirective {
	readonly #select = inject(NgSelectComponent);
	readonly #teamsService = inject(TeamsService);

	constructor() {
		this.#select.items = [];
		this.#select.bindLabel = 'name';
		this.#teamsService
			.getTeamsCanManageResources()
			.pipe(takeUntilDestroyed())
			.subscribe((items) => {
				const change = new SimpleChange(this.#select.items, items, false);

				this.#select.items = items;
				// change detection doesn't work properly when setting input programmatically
				// tslint:disable-next-line:no-lifecycle-call
				this.#select.ngOnChanges({ items: change });
			});
	}
}

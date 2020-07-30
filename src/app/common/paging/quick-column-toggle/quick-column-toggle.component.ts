import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import { QuickFiltersComponent } from '../quick-filters/quick-filters.component';

@UntilDestroy()
@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'quick-column-toggle',
	templateUrl: '../quick-filters/quick-filters.component.html',
	styleUrls: ['../quick-filters/quick-filters.component.scss']
})
export class QuickColumnToggleComponent extends QuickFiltersComponent {
	title = 'Show Columns';

	columnMode = 'default';

	toggleQuickFilter(key: string) {
		if (key === 'all') {
			this.filterKeys.forEach((k: string) => (this.filters[k].show = true));
		} else if (key === 'default') {
			this.filters = JSON.parse(JSON.stringify(this.defaultFilters));
		}

		this.checkColumnConfiguration();
		super.toggleQuickFilter(key);
	}

	private checkColumnConfiguration() {
		if (this.filterKeys.every(key => this.filters[key].show)) {
			this.columnMode = 'all';
		} else if (
			this.filterKeys.some(key => this.filters[key].show !== this.defaultFilters[key].show)
		) {
			this.columnMode = 'custom';
		} else {
			this.columnMode = 'default';
		}
	}
}

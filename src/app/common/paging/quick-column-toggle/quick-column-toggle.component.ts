import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { QuickFiltersComponent } from '../quick-filters/quick-filters.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'quick-column-toggle',
	templateUrl: '../quick-filters/quick-filters.component.html',
	styleUrls: [ '../quick-filters/quick-filters.component.scss' ]
})
export class QuickColumnToggleComponent extends QuickFiltersComponent {

	title = 'Show Columns';

	columnMode = 'default';

	toggleQuickFilter(key: string) {
		if (key === 'all') {
			this.filterKeys.forEach((k: string) => this.filters[k].show = true);
		} else if (key === 'default') {
			this.filters = JSON.parse(JSON.stringify(this.defaultFilters));
		}

		this.checkColumnConfiguration();
		super.toggleQuickFilter(key);
	}

	private checkColumnConfiguration() {
		// Check first to see if all columns are turned on
		this.columnMode = 'all';
		this.filterKeys.some((key: string) => {
			if (!this.filters[key].show) {
				this.columnMode = 'custom';
				return true;
			}
		});

		if (this.columnMode === 'all') {
			return;
		}

		// Check if our default columns are enabled
		this.columnMode = 'default';
		this.filterKeys.some( (key: string) => {
			if (this.filters[key].show !== this.defaultFilters[key].show) {
				this.columnMode = 'custom';
				return true;
			}
		});
	}
}


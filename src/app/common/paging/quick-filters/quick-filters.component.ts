import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'quick-filters',
	templateUrl: 'quick-filters.component.html',
	styleUrls: ['quick-filters.component.scss']
})
export class QuickFiltersComponent implements OnDestroy, OnInit {
	@Input() title = 'Quick Filters';

	@Input() filters: any = {};

	@Input() defaultFilters: any;

	@Output() readonly filtersChange: EventEmitter<any> = new EventEmitter();

	columnMode: string = null;

	shown = true;

	filterKeys: string[] = [];

	toggleFilter$: Subject<string> = new Subject();

	private destroy$: Subject<boolean> = new Subject();

	constructor() {
		this.toggleFilter$
			.pipe(debounceTime(100), takeUntil(this.destroy$))
			.subscribe((key: string) => this.toggleQuickFilter(key));
	}

	ngOnInit() {
		this.filterKeys = Object.keys(this.filters);
	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	toggleQuickFilter(key: string) {
		if (this.filters.hasOwnProperty(key)) {
			this.filters[key].show = !this.filters[key].show;
		}
		this.filtersChange.emit(this.filters);
	}
}

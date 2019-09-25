import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'search-table',
	templateUrl: 'search-table.component.html'
})
export class SearchTableComponent {
	@Input() placeholder = 'Search...';
	@Output() applySearch: EventEmitter<string> = new EventEmitter();
	search = '';
}

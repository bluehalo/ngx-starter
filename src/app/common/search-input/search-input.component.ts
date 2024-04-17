import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output, booleanAttribute } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
	selector: 'asy-search-input',
	templateUrl: './search-input.component.html',
	styleUrls: ['./search-input.component.scss'],
	animations: [
		trigger('minCount', [
			transition(':enter', [
				style({ opacity: 0, height: 0 }),
				animate('200ms ease', style({ opacity: 1, height: '*' }))
			]),
			transition(':leave', [
				style({ opacity: 1, height: '*' }),
				animate('200ms ease', style({ opacity: 0, height: 0 }))
			])
		])
	],
	standalone: true,
	imports: [FormsModule]
})
export class SearchInputComponent {
	@Input()
	placeholder = 'Search...';

	@Input()
	search = '';

	@Output()
	readonly applySearch: EventEmitter<string> = new EventEmitter();

	/**
	 * If true, searches will be made on `input` events, otherwise searches will be made on `keyup` events
	 */
	@Input({ transform: booleanAttribute })
	preferInputEvent = true;

	/**
	 * Specifies a minimum character count required to search.
	 * In the event the number of characters is between 0 and the minimum, a warning message is shown beneath the search bar
	 */
	@Input()
	minSearchCharacterCount = 0;

	/**
	 * When set to true, the minimum search character
	 * message count will not be displayed, even if the search
	 * value is less than the minimum number of characters.
	 */
	@Input({ transform: booleanAttribute })
	disableMinCountMessage = false;

	searchInput$ = new Subject<void>();

	showMinCountMessage = false;

	constructor() {
		this.searchInput$.pipe(debounceTime(350), takeUntilDestroyed()).subscribe(() => {
			if (this.search.length === 0 || this.search.length >= this.minSearchCharacterCount) {
				this.showMinCountMessage = false;
				this.applySearch.emit(this.search);
			} else {
				this.showMinCountMessage = true;
			}
		});
	}

	onKeyup() {
		if (!this.preferInputEvent) {
			this.searchInput$.next();
		}
	}

	onInput() {
		if (this.preferInputEvent) {
			this.searchInput$.next();
		}
	}

	clearSearch(event?: MouseEvent) {
		this.search = '';
		this.applySearch.emit(this.search);
		if (event) {
			event.stopPropagation();
		}
	}
}

import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@UntilDestroy()
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
	]
})
export class SearchInputComponent {
	@Input() placeholder = 'Search...';
	@Output() readonly applySearch: EventEmitter<string> = new EventEmitter();
	@Input() search = '';
	@Input() width = '350px';

	/**
	 * If true, searches will be made on `input` events, otherwise searches will be made on `keyup` events
	 */
	@Input() preferInputEvent: boolean = false;

	/**
	 * Specifies a minimum character count required to search.
	 * In the event the number of characters is between 0 and the minimum, a warning message is shown beneath the search bar
	 */
	@Input() minSearchCharacterCount: number = 0;

	searchInput$ = new Subject<void>();
	showMinCountMessage = false;

	constructor() {
		this.searchInput$.pipe(debounceTime(350), untilDestroyed(this)).subscribe(() => {
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

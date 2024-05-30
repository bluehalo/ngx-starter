import { animate, style, transition, trigger } from '@angular/animations';
import {
	ChangeDetectionStrategy,
	Component,
	booleanAttribute,
	input,
	model,
	output,
	signal
} from '@angular/core';
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
	imports: [FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchInputComponent {
	search = model('');

	readonly placeholder = input('Search...');

	/**
	 * If true, searches will be made on `input` events, otherwise searches will be made on `keyup` events
	 */
	readonly preferInputEvent = input(true, { transform: booleanAttribute });

	/**
	 * Specifies a minimum character count required to search.
	 * In the event the number of characters is between 0 and the minimum, a warning message is shown beneath the search bar
	 */
	readonly minSearchCharacterCount = input(0);

	/**
	 * When set to true, the minimum search character
	 * message count will not be displayed, even if the search
	 * value is less than the minimum number of characters.
	 */
	readonly disableMinCountMessage = input(false, { transform: booleanAttribute });

	readonly showMinCountMessage = signal(false);

	readonly applySearch = output<string>();

	searchInput$ = new Subject<void>();

	constructor() {
		this.searchInput$.pipe(debounceTime(350), takeUntilDestroyed()).subscribe(() => {
			if (
				this.search().length === 0 ||
				this.search().length >= this.minSearchCharacterCount()
			) {
				this.showMinCountMessage.set(false);
				this.applySearch.emit(this.search());
			} else {
				this.showMinCountMessage.set(true);
			}
		});
	}

	onKeyup() {
		if (!this.preferInputEvent()) {
			this.searchInput$.next();
		}
	}

	onInput() {
		if (this.preferInputEvent()) {
			this.searchInput$.next();
		}
	}

	clearSearch(event?: MouseEvent) {
		this.search.set('');
		this.applySearch.emit(this.search());
		if (event) {
			event.stopPropagation();
		}
	}
}

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'asy-search-input',
	templateUrl: './search-input.component.html',
	styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {
	@Input() placeholder = 'Search...';
	@Output() readonly applySearch: EventEmitter<string> = new EventEmitter();
	@Input() search = '';

	private keyupTimeout;

	constructor() {}

	onKeyup() {
		clearTimeout(this.keyupTimeout);
		this.keyupTimeout = setTimeout(() => {
			this.applySearch.emit(this.search);
		}, 350);
	}

	clearSearch(event?: MouseEvent) {
		this.search = '';
		this.applySearch.emit(this.search);
		if (event) {
			event.stopPropagation();
		}
	}
}

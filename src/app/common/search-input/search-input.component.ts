import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'asy-search-input',
	templateUrl: './search-input.component.html',
	styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

	@Input() placeholder: string = 'Search...';
	@Input() width: string = '500';
	@Output() applySearch: EventEmitter<string> = new EventEmitter();
	search: string = '';

	private keyupTimeout;

	constructor() { }

	onKeyup() {
		clearTimeout(this.keyupTimeout);
		this.keyupTimeout = setTimeout(() => {
			this.applySearch.emit(this.search);
		}, 350);
	}

	clearSearch() {
		this.search = '';
		this.applySearch.emit(this.search);
	}

	ngOnInit() {
	}

}

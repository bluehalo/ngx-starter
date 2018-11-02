import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

const defaultKey = 'getting-started';

@Component({
	template: '<help-topic [key]="key"></help-topic>'
})
export class HelpTopicWrapperComponent {

	key: string = defaultKey;

	constructor(
		private route: ActivatedRoute,
	) {
		route.params.subscribe((params: Params) => {
			this.key = params.topic;
		});
	}
}

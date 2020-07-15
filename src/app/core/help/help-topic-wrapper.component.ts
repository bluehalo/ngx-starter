import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

const defaultKey = 'getting-started';

@UntilDestroy()
@Component({
	template: '<help-topic [key]="key"></help-topic>'
})
export class HelpTopicWrapperComponent {
	key: string = defaultKey;

	constructor(private route: ActivatedRoute) {
		route.params.pipe(untilDestroyed(this)).subscribe((params: Params) => {
			this.key = params.topic;
		});
	}
}

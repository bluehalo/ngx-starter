import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { HelpTopicComponent } from './help-topic.component';

const defaultKey = 'getting-started';

@UntilDestroy()
@Component({
	template: '<help-topic [key]="key"></help-topic>',
	standalone: true,
	imports: [HelpTopicComponent]
})
export class HelpTopicWrapperComponent {
	key: string = defaultKey;

	constructor(private route: ActivatedRoute) {
		route.params.pipe(untilDestroyed(this)).subscribe((params: Params) => {
			this.key = params['topic'];
		});
	}
}

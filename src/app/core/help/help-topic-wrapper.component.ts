import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params } from '@angular/router';

import { HelpTopicComponent } from './help-topic.component';

const defaultKey = 'getting-started';

@Component({
	template: '<help-topic [key]="key"></help-topic>',
	standalone: true,
	imports: [HelpTopicComponent]
})
export class HelpTopicWrapperComponent {
	key: string = defaultKey;

	constructor(private route: ActivatedRoute) {
		route.params.pipe(takeUntilDestroyed()).subscribe((params: Params) => {
			this.key = params['topic'];
		});
	}
}

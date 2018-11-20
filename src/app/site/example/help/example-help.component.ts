import { Component } from '@angular/core';

import { HelpTopics } from '../../../core/help/help-topic.component';

@Component({
	template: '<p>Example help content.</p>'
})
export class ExampleHelpComponent {}
HelpTopics.registerTopic('example', ExampleHelpComponent, 7);

import { Component } from '@angular/core';

import { AdminTopics } from '../../../common/admin/admin-topic.model';

@Component({
	selector: 'app-admin-example',
	templateUrl: './admin-example.component.html',
	standalone: true
})
export class AdminExampleComponent {}

AdminTopics.registerTopic({
	id: 'example',
	ordinal: 10,
	path: 'example',
	title: 'Example'
});

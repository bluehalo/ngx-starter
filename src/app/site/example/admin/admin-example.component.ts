import { Component, OnInit } from '@angular/core';

import { AdminTopics } from '../../../common/admin/admin-topic.model';

@Component({
	selector: 'app-admin-example',
	templateUrl: './admin-example.component.html'
})
export class AdminExampleComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}

AdminTopics.registerTopic({
	id: 'example',
	ordinal: 10,
	path: 'example',
	title: 'Example'
});

import { Component } from '@angular/core';
import { AdminTopic, AdminTopics } from './admin-topic.model';

@Component({
	templateUrl: 'admin.component.html',
	styleUrls: ['admin.component.scss']
})
export class AdminComponent {
	helpTopics: AdminTopic[] = [];

	title: string;

	constructor() {
		this.helpTopics = AdminTopics.getTopics();
	}
}

import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AdminTopic, AdminTopics } from './admin-topic.model';

@Component({
	templateUrl: 'admin.component.html',
	styleUrls: ['admin.component.scss'],
	standalone: true,
	imports: [NgFor, RouterLinkActive, RouterLink, RouterOutlet]
})
export class AdminComponent {
	helpTopics: AdminTopic[] = [];

	constructor() {
		this.helpTopics = AdminTopics.getTopics();
	}
}

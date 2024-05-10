import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { injectAdminTopics } from './admin-topic.model';

@Component({
	templateUrl: 'admin.component.html',
	styleUrls: ['admin.component.scss'],
	standalone: true,
	imports: [RouterLinkActive, RouterLink, RouterOutlet]
})
export class AdminComponent {
	readonly helpTopics = injectAdminTopics();
}

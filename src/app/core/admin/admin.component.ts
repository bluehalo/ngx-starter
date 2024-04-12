import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ADMIN_TOPICS } from './admin-topic.model';

@Component({
	templateUrl: 'admin.component.html',
	styleUrls: ['admin.component.scss'],
	standalone: true,
	imports: [RouterLinkActive, RouterLink, RouterOutlet]
})
export class AdminComponent {
	helpTopics = inject(ADMIN_TOPICS).flat();
}

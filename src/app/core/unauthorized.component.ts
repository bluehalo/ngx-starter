import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="p-5 text-center bg-body-tertiary rounded-3">
			<h1 class="text-body-emphasis" [innerHTML]="title"></h1>
			<p class="load" [innerHTML]="message"></p>
		</div>
	`,
	standalone: true
})
export class UnauthorizedComponent {
	title = 'Not Authorized';
	message = `You are not authorized to view this page.<br/> If you got here by accident, please <a href="/">go back home</a> and try again.`;
}

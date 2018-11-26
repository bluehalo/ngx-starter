import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="container">
			<div class="row">
				<div class="col-md-8 offset-2 jumbotron" style="margin-top: 4rem;">

					<h1 [innerHTML]="title"></h1>
					<p [innerHTML]="message"></p>

				</div>
			</div>
		</div>
	`,
})
export class UnauthorizedComponent {
	title: string = `&#x0CA0;_&#x0CA0;<br/><br/>Not Authorized`;
	message: string = `You are not authorized to view this page. If you got here by accident, please <a href="/">go back home</a> and try again.`;
}

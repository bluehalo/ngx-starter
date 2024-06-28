import { Component, input } from '@angular/core';

@Component({
	selector: 'loading-spinner',
	templateUrl: './loading-spinner.component.html',
	styleUrls: ['./loading-spinner.component.scss'],
	standalone: true
})
export class LoadingSpinnerComponent {
	readonly message = input('Loading...');
}

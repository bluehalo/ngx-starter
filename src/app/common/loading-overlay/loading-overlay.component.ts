import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { NotificationComponent } from '../notification/notification.component';

@Component({
	selector: 'loading-overlay',
	templateUrl: 'loading-overlay.component.html',
	styleUrls: ['loading-overlay.component.scss'],
	standalone: true,
	imports: [NotificationComponent, LoadingSpinnerComponent],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingOverlayComponent {
	readonly message = input('Loading...');
	readonly isLoading = input(false);
	readonly isError = input(false);
	readonly errorMessage = input('');

	readonly retry = output();
}

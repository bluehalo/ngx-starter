import { DEFAULT_DIALOG_CONFIG, DialogModule } from '@angular/cdk/dialog';
import { importProvidersFrom, makeEnvironmentProviders } from '@angular/core';

import { BsDialogContainerComponent } from './bs-dialog-container/bs-dialog-container.component';

export function provideCdkDialog() {
	return makeEnvironmentProviders([
		importProvidersFrom(DialogModule),
		{
			provide: DEFAULT_DIALOG_CONFIG,
			useValue: {
				closeOnNavigation: true,
				container: BsDialogContainerComponent,
				panelClass: 'modal',
				autoFocus: true,
				hasBackdrop: true
			}
		}
	]);
}

import { CdkDialogContainer, DialogConfig } from '@angular/cdk/dialog';
import { PortalModule } from '@angular/cdk/portal';
import { Component } from '@angular/core';

/**
 * Custom CDK Dialog Container to properly apply bootstrap modal styles
 */
@Component({
	selector: 'bs-dialog-container',
	standalone: true,
	imports: [PortalModule],
	templateUrl: './bs-dialog-container.component.html'
})
export class BsDialogContainerComponent<
	C extends DialogConfig = DialogConfig
> extends CdkDialogContainer<C> {}

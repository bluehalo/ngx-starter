import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: 'signed-up.component.html'
})
export class SignedUpComponent {}

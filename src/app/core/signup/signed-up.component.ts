import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: 'signed-up.component.html',
	standalone: true,
	imports: [RouterLink]
})
export class SignedUpComponent {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MasqueradeComponent } from './masquerade/masquerade.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: 'masquerade',
				component: MasqueradeComponent
			}
		])
	],
	exports: [RouterModule],
	declarations: []
})
export class MasqueradeRoutingModule {}

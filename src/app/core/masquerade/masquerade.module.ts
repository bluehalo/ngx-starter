import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { LoadingSpinnerModule } from '../../common/loading-spinner.module';
import { MasqueradeRoutingModule } from './masquerade-routing.module';
import { MasqueradeInterceptor } from './masquerade.interceptor';
import { MasqueradeService } from './masquerade.service';
import { MasqueradeComponent } from './masquerade/masquerade.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgSelectModule,
		MasqueradeRoutingModule,
		LoadingSpinnerModule
	],
	declarations: [MasqueradeComponent],
	providers: [
		MasqueradeService,
		{ provide: HTTP_INTERCEPTORS, useClass: MasqueradeInterceptor, multi: true }
	]
})
export class MasqueradeModule {}

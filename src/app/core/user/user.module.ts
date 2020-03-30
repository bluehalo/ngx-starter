import { NgModule } from '@angular/core';
import { UserPreferenceModule } from './user-preference/user-preference.module';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
	imports: [UserPreferenceModule, UserRoutingModule],
	exports: [],
	entryComponents: [],
	declarations: [],
	providers: []
})
export class UserModule {}

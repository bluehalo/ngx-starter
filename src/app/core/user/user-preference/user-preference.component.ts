import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { TemplateDataStore } from '../../template-data.store';

@Component({
	templateUrl: 'user-preference.component.html'
})
export class UserPreferenceComponent implements OnInit {
	@Input() template: TemplateRef<any>;

	userPreferenceTemplate: TemplateRef<any>;

	ngOnInit(): void {
		this.userPreferenceTemplate = TemplateDataStore.userPreferencesTemplate;
	}
}

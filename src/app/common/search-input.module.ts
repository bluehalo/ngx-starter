import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { SearchInputComponent } from './search-input/search-input.component';

@NgModule({
	imports: [CommonModule, FormsModule, NgSelectModule],
	exports: [SearchInputComponent],
	declarations: [SearchInputComponent],
	providers: []
})
export class SearchInputModule {}

export { SearchInputComponent } from './search-input/search-input.component';

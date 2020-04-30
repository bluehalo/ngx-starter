import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { MultiSelectInputComponent } from './multi-select-input/multi-select-input.component';

@NgModule({
	imports: [CommonModule, FormsModule, NgSelectModule],
	exports: [MultiSelectInputComponent],
	declarations: [MultiSelectInputComponent],
	providers: []
})
export class MultiSelectInputModule {}

export { MultiSelectInputComponent } from './multi-select-input/multi-select-input.component';

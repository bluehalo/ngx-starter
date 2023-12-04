import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, Input, ViewChild, forwardRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { Observable } from 'rxjs';

import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@Component({
	selector: 'app-team-select-input',
	templateUrl: './team-select-input.component.html',
	styleUrls: ['./team-select-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TeamSelectInputComponent),
			multi: true
		}
	],
	standalone: true,
	imports: [NgSelectModule, FormsModule, AsyncPipe]
})
export class TeamSelectInputComponent implements ControlValueAccessor {
	@ViewChild(NgModel, { static: true })
	model?: NgModel;

	@Input() placeholder = '';

	private innerValue?: Team;
	private changed = new Array<(value: Team | undefined) => void>();
	private touched = new Array<() => void>();

	options$: Observable<Team[]>;

	private destroyRef = inject(DestroyRef);
	private teamsService = inject(TeamsService);

	constructor() {
		this.options$ = this.teamsService.getTeamsCanManageResources().pipe(takeUntilDestroyed());
	}

	get value(): Team | undefined {
		return this.innerValue;
	}

	set value(value: Team | undefined) {
		if (this.innerValue !== value) {
			this.writeValue(value);
			this.propagateChange();
		}
	}

	writeValue(value: Team | undefined) {
		this.innerValue = value;
	}

	registerOnChange(fn: (value: Team | undefined) => void) {
		this.changed.push(fn);
	}

	registerOnTouched(fn: () => void) {
		this.touched.push(fn);
	}

	propagateChange() {
		this.changed.forEach((f) => f(this.innerValue));
	}
}

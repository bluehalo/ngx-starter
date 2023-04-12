import { Component, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@UntilDestroy()
@Component({
	selector: 'app-team-select-input',
	templateUrl: './team-select-input.component.html',
	styleUrls: ['./team-select-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: TeamSelectInputComponent,
			multi: true
		}
	]
})
export class TeamSelectInputComponent implements ControlValueAccessor {
	@ViewChild(NgModel, { static: true })
	model?: NgModel;

	@Input() placeholder = '';

	private innerValue?: Team;
	private changed = new Array<(value: Team | undefined) => void>();
	private touched = new Array<() => void>();

	options$: Observable<Team[]>;

	constructor(private teamsService: TeamsService) {
		this.options$ = this.teamsService.getTeamsCanManageResources().pipe(untilDestroyed(this));
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

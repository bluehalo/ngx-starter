import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgModel, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgSelectComponent } from '@ng-select/ng-select';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
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
export class TeamSelectInputComponent implements ControlValueAccessor, OnDestroy, OnInit {
	@ViewChild(NgModel, { static: true })
	model: NgModel;

	@Input() placeholder: string;

	private innerValue: Team;
	private changed = new Array<(value: Team) => void>();
	private touched = new Array<() => void>();

	options$: Observable<Team[]>;

	constructor(private teamsService: TeamsService) {}

	ngOnDestroy() {}

	ngOnInit() {
		this.options$ = this.teamsService.getTeamsCanManageResources().pipe(untilDestroyed(this));
	}

	get value(): Team {
		return this.innerValue;
	}

	set value(value: Team) {
		if (this.innerValue !== value) {
			this.writeValue(value);
			this.propagateChange();
		}
	}

	writeValue(value: Team) {
		this.innerValue = value;
	}

	registerOnChange(fn: (value: Team) => void) {
		this.changed.push(fn);
	}

	registerOnTouched(fn: () => void) {
		this.touched.push(fn);
	}

	propagateChange() {
		this.changed.forEach(f => f(this.innerValue));
	}
}

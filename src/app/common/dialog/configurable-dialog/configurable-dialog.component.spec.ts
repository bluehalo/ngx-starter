import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurableDialogComponent } from './configurable-dialog.component';

describe('ConfigurableDialogComponent', () => {
	let component: ConfigurableDialogComponent;
	let fixture: ComponentFixture<ConfigurableDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ConfigurableDialogComponent, DialogModule],
			providers: [
				{ provide: DIALOG_DATA, useValue: {} },
				{ provide: DialogRef, useValue: {} }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ConfigurableDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

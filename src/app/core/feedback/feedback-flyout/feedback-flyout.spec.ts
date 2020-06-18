import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { AsyncSubject } from 'rxjs';
import { FlyoutComponent } from 'src/app/common/flyout/flyout.component';
import { ConfigService } from '../../config.service';
import { Feedback } from '../feedback.model';
import { FeedbackService } from '../feedback.service';
import { FeedbackFlyoutComponent } from './feedback-flyout.component';

// mock configuration object
const configSubject = new AsyncSubject();
const mockConfigObject = {
	app: { clientUrl: 'mock-config-url' },
	feedback: { classificationOpts: ['classification-1', 'classification-2'] }
};
configSubject.next(mockConfigObject);
configSubject.complete();
const mockSubmitFunction = jasmine.createSpy();

describe('FeedbackFlyoutComponent', () => {
	let fixture: ComponentFixture<FeedbackFlyoutComponent>;
	let instance: FeedbackFlyoutComponent;
	let element: DebugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FeedbackFlyoutComponent, FlyoutComponent],
			imports: [BrowserModule, FormsModule, NgSelectModule],
			providers: [
				{ provide: Router, useValue: { url: 'test-url' } },
				{ provide: ConfigService, useValue: { getConfig: () => configSubject } },
				{ provide: FeedbackService, useValue: { submit: mockSubmitFunction } }
			]
		})
			.compileComponents()
			.then(() => {
				fixture = TestBed.createComponent(FeedbackFlyoutComponent);
				instance = fixture.componentInstance;
				element = fixture.debugElement;

				fixture.autoDetectChanges();
			});
	}));

	it('should set the correct properties after loading config', async(() => {
		// test that baseUrl is set
		expect(instance.baseUrl).toEqual(mockConfigObject.app.clientUrl);

		// test that classification options are set
		expect(instance.classificationOptions).toEqual(
			mockConfigObject.feedback.classificationOpts
		);
	}));

	it('should set the appropriate feedback type when clicking top-level radio buttons', async(() => {
		const radioButtons = element.queryAll(By.css('[name="type-option-radio"]'));

		// ensure that we found all three options
		expect(radioButtons.length).toBe(3);

		for (const btn of radioButtons) {
			const expectedValue = btn.attributes.value;
			btn.triggerEventHandler('change', {});
			expect(instance.feedback.type).toEqual(expectedValue);
		}
	}));

	it('should set the appropriate feedback subType when clicking radio buttons under Bug Report', async(() => {
		const bugReportRadioButton = element.query(By.css('#fo-type-option-3'));
		expect(bugReportRadioButton).toBeDefined();

		bugReportRadioButton.triggerEventHandler('change', {});
		expect(instance.feedback.type).toEqual(bugReportRadioButton.attributes.value);

		const bugReportTypeOptions = element.queryAll(By.css('[name="subtype-option-radio"]'));

		for (const btn of bugReportTypeOptions) {
			btn.triggerEventHandler('change', {});
			expect(instance.feedback.subType).toEqual(btn.attributes.value);
		}
	}));

	it('should show submit button as disabled when form is invalid', async(() => {
		// locate the submit button and validate that it is disabled
		const submitButton = element.query(By.css('button#submit'));

		expect((submitButton.nativeNode as HTMLButtonElement).disabled).toBeTruthy();
	}));

	it('should allow submission when form is valid', async(() => {
		const typeOption = element.query(By.css('#fo-type-option-1'));
		expect(typeOption).toBeDefined();
		typeOption.triggerEventHandler('change', {});

		fixture.detectChanges();

		const textBox = element.query(By.css('textarea'));
		expect(textBox).toBeDefined();
		textBox.nativeElement.value = 'Nice app!';

		// locate the submit button and validate that it is disabled
		const submitButton = element.query(By.css('button#submit'));
		expect((submitButton.nativeNode as HTMLButtonElement).disabled).toBeFalsy();
	}));
});

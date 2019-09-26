import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerComponent } from './loading-spinner.component';

import _forEach from 'lodash/forEach';

@Component({
	template: '<loading-spinner></loading-spinner>'
})
export class LoadingSpinnerDefaultTestHostComponent {}

@Component({
	template: '<loading-spinner [message]="message"></loading-spinner>'
})
export class LoadingSpinnerProvidedTestHostComponent {
	message = 'Bootstrapping...';
}

describe('LoadingSpinnerComponent', () => {

	let defaultFixture: ComponentFixture<LoadingSpinnerDefaultTestHostComponent>;
	let defaultTestHost: LoadingSpinnerDefaultTestHostComponent;
	let defaultRootHTMLElement: HTMLElement;

	let providedFixture: ComponentFixture<LoadingSpinnerProvidedTestHostComponent>;
	let providedTestHost: LoadingSpinnerProvidedTestHostComponent;
	let providedRootHTMLElement: HTMLElement;

	beforeEach(() => {
		const testbed = TestBed.configureTestingModule({
			imports: [],
			declarations: [
				LoadingSpinnerDefaultTestHostComponent,
				LoadingSpinnerProvidedTestHostComponent,
				LoadingSpinnerComponent
			]
		});

		defaultFixture = testbed.createComponent(LoadingSpinnerDefaultTestHostComponent);
		defaultTestHost = defaultFixture.componentInstance;
		defaultRootHTMLElement = defaultFixture.debugElement.nativeElement;
		defaultFixture.detectChanges();

		providedFixture = testbed.createComponent(LoadingSpinnerProvidedTestHostComponent);
		providedTestHost = providedFixture.componentInstance;
		providedRootHTMLElement = providedFixture.debugElement.nativeElement;
		providedFixture.detectChanges();
	});

	it('should display default loading message', () => {
		const expectedContent = 'Loading...';
		defaultFixture.detectChanges();
		expect(defaultRootHTMLElement.innerText).toContain(expectedContent);
	});

	it('should display provided loading message', () => {
		const expectedContent = 'Bootstrapping...';
		providedFixture.detectChanges();
		expect(providedRootHTMLElement.innerText).toContain(expectedContent);
	});

	it('should display changed provided loading message', () => {
		const expectedContent = 'Almost done...';
		providedTestHost.message = expectedContent;
		providedFixture.detectChanges();
		expect(providedRootHTMLElement.innerText).toContain(expectedContent);
	});

});

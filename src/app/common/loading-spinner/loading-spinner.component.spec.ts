import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerComponent } from './loading-spinner.component';

@Component({
	template: '<loading-spinner />',
	standalone: true,
	imports: [LoadingSpinnerComponent]
})
export class LoadingSpinnerDefaultTestHostComponent {}

@Component({
	template: '<loading-spinner [message]="message" />',
	standalone: true,
	imports: [LoadingSpinnerComponent]
})
export class LoadingSpinnerProvidedTestHostComponent {
	message = 'Bootstrapping...';
}

describe('LoadingSpinnerComponent', () => {
	let defaultFixture: ComponentFixture<LoadingSpinnerDefaultTestHostComponent>;
	let defaultRootHTMLElement: HTMLElement;

	let providedFixture: ComponentFixture<LoadingSpinnerProvidedTestHostComponent>;
	let providedTestHost: LoadingSpinnerProvidedTestHostComponent;
	let providedRootHTMLElement: HTMLElement;

	beforeEach(() => {
		const testbed = TestBed.configureTestingModule({
			imports: [
				LoadingSpinnerDefaultTestHostComponent,
				LoadingSpinnerProvidedTestHostComponent,
				LoadingSpinnerComponent
			]
		});

		defaultFixture = testbed.createComponent(LoadingSpinnerDefaultTestHostComponent);
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

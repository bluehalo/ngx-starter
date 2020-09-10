import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';

@Component({
	template:
		'<notification [message]="message">' +
		'<ng-template #notificationActions id="tableActions"><button>bar</button></ng-template></notification>'
})
export class NotificationDefaultTestHostComponent {
	message = 'foo';
}

@Component({
	template:
		'<notification [message]="message" [showActions]="true">' +
		'<ng-template #notificationActions id="tableActions"><button>bar</button></ng-template>' +
		'</notification>'
})
export class NotificationProvidedTestHostComponent {
	message = 'foo';
}

describe('NotificationComponent', () => {
	let defaultFixture: ComponentFixture<NotificationDefaultTestHostComponent>;
	let defaultRootHTMLElement: HTMLElement;

	let providedFixture: ComponentFixture<NotificationProvidedTestHostComponent>;
	let providedTestHost: NotificationProvidedTestHostComponent;
	let providedRootHTMLElement: HTMLElement;

	beforeEach(() => {
		const testbed = TestBed.configureTestingModule({
			imports: [],
			declarations: [
				NotificationDefaultTestHostComponent,
				NotificationProvidedTestHostComponent,
				NotificationComponent
			]
		});

		defaultFixture = testbed.createComponent(NotificationDefaultTestHostComponent);
		defaultRootHTMLElement = defaultFixture.debugElement.nativeElement;
		defaultFixture.detectChanges();

		providedFixture = testbed.createComponent(NotificationProvidedTestHostComponent);
		providedTestHost = providedFixture.componentInstance;
		providedRootHTMLElement = providedFixture.debugElement.nativeElement;
		providedFixture.detectChanges();
	});

	it('should display provided message', () => {
		const expectedContent = 'foo';
		defaultFixture.detectChanges();
		expect(defaultRootHTMLElement.innerText).toContain(expectedContent);
	});

	it('should not display provided actions template', () => {
		defaultFixture.detectChanges();
		expect(defaultRootHTMLElement.getElementsByTagName('button').length).toBe(0);
	});

	it('should display provided actions template', () => {
		const expectedContent = 'bar';
		providedFixture.detectChanges();
		expect(providedRootHTMLElement.getElementsByTagName('button')[0].innerText).toContain(
			expectedContent
		);
	});
});

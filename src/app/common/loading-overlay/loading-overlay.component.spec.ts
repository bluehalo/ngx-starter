import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingOverlayComponent } from './loading-overlay.component';

describe('LoadingOverlayComponent', () => {
	let fixture: ComponentFixture<LoadingOverlayComponent>;
	let rootHTMLElement: HTMLElement;
	let component: LoadingOverlayComponent;

	beforeEach(() => {
		const testbed = TestBed.configureTestingModule({
			imports: [LoadingOverlayComponent]
		});

		fixture = testbed.createComponent(LoadingOverlayComponent);
		component = fixture.componentInstance;
		rootHTMLElement = fixture.debugElement.nativeElement;
		fixture.detectChanges();
	});

	it('should display loading overlay and loading spinner', () => {
		component.isLoading = true;
		fixture.detectChanges();
		expect(rootHTMLElement.getElementsByClassName('overlay').length).toEqual(1);
		expect(rootHTMLElement.getElementsByClassName('overlay-spinner').length).toEqual(1);
		expect(rootHTMLElement.getElementsByClassName('notification-container').length).toEqual(0);
	});

	it('should display loading overlay and error message', () => {
		component.isLoading = true;
		component.isError = true;
		fixture.detectChanges();
		expect(rootHTMLElement.getElementsByClassName('overlay').length).toEqual(1);
		expect(rootHTMLElement.getElementsByClassName('overlay-spinner').length).toEqual(0);
		expect(rootHTMLElement.getElementsByClassName('notification-container').length).toEqual(1);
	});

	it('should not display loading overlay', () => {
		component.isLoading = false;
		fixture.detectChanges();
		expect(rootHTMLElement.getElementsByClassName('overlay').length).toEqual(0);
		expect(rootHTMLElement.getElementsByClassName('overlay-spinner').length).toEqual(0);
		expect(rootHTMLElement.getElementsByClassName('notification-container').length).toEqual(0);
	});
});

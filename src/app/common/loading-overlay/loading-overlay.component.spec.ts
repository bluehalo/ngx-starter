import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingOverlayComponent } from './loading-overlay.component';

describe('LoadingOverlayComponent', () => {
	let fixture: ComponentFixture<LoadingOverlayComponent>;
	let rootHTMLElement: HTMLElement;

	beforeEach(() => {
		fixture = TestBed.configureTestingModule({
			imports: [LoadingOverlayComponent]
		}).createComponent(LoadingOverlayComponent);

		rootHTMLElement = fixture.debugElement.nativeElement;
		fixture.detectChanges();
	});

	it('should display loading overlay and loading spinner', () => {
		fixture.componentRef.setInput('isLoading', true);
		fixture.detectChanges();
		// expect(rootHTMLElement.innerHTML).toEqual('');
		// expect(fixture.debugElement.query(By.css('.overlay'))).toBeDefined();
		expect(rootHTMLElement.getElementsByClassName('overlay').length).toEqual(1);
		expect(rootHTMLElement.getElementsByClassName('overlay-spinner').length).toEqual(1);
		expect(rootHTMLElement.getElementsByClassName('alert').length).toEqual(0);
	});

	it('should display loading overlay and error message', () => {
		fixture.componentRef.setInput('isLoading', true);
		fixture.componentRef.setInput('isError', true);
		fixture.detectChanges();
		expect(rootHTMLElement.getElementsByClassName('overlay').length).toEqual(1);
		expect(rootHTMLElement.getElementsByClassName('overlay-spinner').length).toEqual(0);
		expect(rootHTMLElement.getElementsByClassName('alert').length).toEqual(1);
	});

	it('should not display loading overlay', () => {
		fixture.componentRef.setInput('isLoading', false);
		fixture.detectChanges();
		expect(rootHTMLElement.getElementsByClassName('overlay').length).toEqual(0);
		expect(rootHTMLElement.getElementsByClassName('overlay-spinner').length).toEqual(0);
		expect(rootHTMLElement.getElementsByClassName('alert').length).toEqual(0);
	});
});

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DOMUtils } from './dom-utils.service';

@Component({
	selector: 'test-component',
	template: `
		<div id="subset">
			<button></button>
			<select></select>
			<textarea></textarea>
			<input />
			<a href="foo"></a>
			<p tabindex="-1"></p>
		</div>
	`
})
class TestComponent {}

describe('DOMUtils', () => {
	let fixture: ComponentFixture<TestComponent>;
	let comp: TestComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			declarations: [TestComponent],
			providers: []
		});

		fixture = TestBed.createComponent(TestComponent);
		comp = fixture.componentInstance;
	});
	describe('#getFocusableElements', () => {
		it('should return only the default focusable elements for the whole document', () => {
			// The expected number, 8, is the 5 elements that should be included from the template
			// plus 3 that are added by jasmine that each have href attributes
			expect(DOMUtils.getFocusableElements(document).length).toBe(8);
		});
		it('should return only the default focusable elements for the indicated subset of the document', () => {
			expect(DOMUtils.getFocusableElements(document, '#subset').length).toBe(5);
		});
		it('should return only the supplied focusable elements', () => {
			expect(DOMUtils.getFocusableElements(document, '#subset', 'button').length).toBe(1);
		});
	});

	describe('#trapFocus', () => {
		it('should call getFocusableElements and add a keydown event listener', () => {
			spyOn(DOMUtils, 'getFocusableElements').and.callThrough();
			spyOn(document, 'addEventListener').and.callThrough();

			DOMUtils.trapFocus(document, 'subset');
			expect(DOMUtils.getFocusableElements).toHaveBeenCalledTimes(1);
			expect(document.addEventListener).toHaveBeenCalledTimes(1);
		});
	});
});

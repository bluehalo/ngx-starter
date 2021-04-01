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
		fixture.detectChanges();
	});
	describe('#getFocusableElements', () => {
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

		it('should loop to first element when last element is focused and tab key is pressed', done => {
			window.setTimeout(() => {
				const focusableElements = DOMUtils.getFocusableElements(document, '#subset');
				DOMUtils.trapFocus(document, '#subset');

				focusableElements[focusableElements.length - 1].focus();
				document.dispatchEvent(
					new KeyboardEvent('keydown', {
						key: 'Tab'
					})
				);
				expect(document.activeElement).toEqual(focusableElements[0]);
				done();
			}, 0);
		});

		it('should loop to last element when first element is focused and shift-tab key is pressed', done => {
			window.setTimeout(() => {
				const focusableElements = DOMUtils.getFocusableElements(document, '#subset');
				DOMUtils.trapFocus(document, '#subset');

				focusableElements[0].focus();
				document.dispatchEvent(
					new KeyboardEvent('keydown', {
						key: 'Tab',
						shiftKey: true
					})
				);
				expect(document.activeElement).toEqual(
					focusableElements[focusableElements.length - 1]
				);
				done();
			}, 0);
		});
	});
});

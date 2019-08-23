import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * Used to mark where in a page the "Skip to main content" link
 * should skip to. It is ideally placed on the page's main heading:
 * the h1 element. This directive should only be used once per page
 */
@Directive({
	selector: '[skipTo]'
})
export class SkipToDirective {
	constructor(
		private elRef: ElementRef,
		private renderer: Renderer2
	) {
		const el = elRef.nativeElement;
		renderer.setAttribute(el, 'id', 'skip-to');
		renderer.setAttribute(el, 'tabindex', '-1');
	}
}

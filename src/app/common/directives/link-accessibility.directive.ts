import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Used to enable link for keyboard accessibility.
 * This is only necessary for interactibles using that do not have a
 * href attribute, because those will naturally be ignored by
 * the tabbing structure.
 */
@Directive({
	selector: '[linkAccessibility]'
})
export class LinkAccessibilityDirective {
	constructor(private elRef: ElementRef, private renderer: Renderer2, private router: Router) {
		const el = elRef.nativeElement;
		renderer.setAttribute(el, 'tabIndex', '0');
	}

	@HostListener('keydown.enter', ['$event'])
	@HostListener('keydown.space', ['$event'])
	onEnter(event: Event) {
		let targetEl: any = event.target;
		targetEl?.dispatchEvent(new Event('click'));

		if (targetEl?.attributes.href) {
			const hrefVal = targetEl?.attributes.href.value;
			const path = hrefVal[0] === '#' ? hrefVal.substring(1) : hrefVal;
			this.router.navigate([path]);
		}
	}
}

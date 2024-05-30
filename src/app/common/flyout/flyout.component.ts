import { NgClass } from '@angular/common';
import {
	Component,
	ElementRef,
	Renderer2,
	contentChild,
	inject,
	input,
	signal,
	viewChild
} from '@angular/core';

@Component({
	selector: 'app-flyout',
	templateUrl: './flyout.component.html',
	styleUrls: ['./flyout.component.scss'],
	standalone: true,
	imports: [NgClass]
})
export class FlyoutComponent {
	readonly #renderer = inject(Renderer2);

	readonly container = viewChild.required<ElementRef>('flyoutContentContainer');
	readonly content = contentChild.required<ElementRef>('flyoutContent');

	readonly label = input('');
	readonly placement = input<'left' | 'right' | 'top' | 'bottom'>('right');

	readonly isOpen = signal(false);

	toggle() {
		if (this.content() && this.container()) {
			if (this.placement() === 'top' || this.placement() === 'bottom') {
				if (this.isOpen()) {
					this.#renderer.setStyle(this.container().nativeElement, 'height', 0);
				} else {
					this.#renderer.setStyle(
						this.container().nativeElement,
						'height',
						`${this.content().nativeElement.clientHeight}px`
					);
				}
			} else {
				if (this.isOpen()) {
					this.#renderer.setStyle(this.container().nativeElement, 'width', 0);
				} else {
					this.#renderer.setStyle(
						this.container().nativeElement,
						'width',
						`${this.content().nativeElement.clientWidth}px`
					);
				}
			}

			this.isOpen.set(!this.isOpen());
		}
	}
}

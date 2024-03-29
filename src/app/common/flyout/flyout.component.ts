import { NgClass } from '@angular/common';
import {
	Component,
	ContentChild,
	ElementRef,
	Input,
	Renderer2,
	ViewChild,
	inject
} from '@angular/core';

@Component({
	selector: 'app-flyout',
	templateUrl: './flyout.component.html',
	styleUrls: ['./flyout.component.scss'],
	standalone: true,
	imports: [NgClass]
})
export class FlyoutComponent {
	@ViewChild('flyoutContentContainer') container?: ElementRef;
	@ContentChild('flyoutContent') content?: ElementRef;

	@Input()
	label = '';

	@Input()
	placement: 'left' | 'right' | 'top' | 'bottom' = 'right';

	isOpen = false;

	private renderer = inject(Renderer2);

	toggle() {
		if (this.content && this.container) {
			if (this.placement === 'top' || this.placement === 'bottom') {
				if (this.isOpen) {
					this.renderer.setStyle(this.container.nativeElement, 'height', 0);
				} else {
					this.renderer.setStyle(
						this.container.nativeElement,
						'height',
						`${this.content.nativeElement.clientHeight}px`
					);
				}
			} else {
				if (this.isOpen) {
					this.renderer.setStyle(this.container.nativeElement, 'width', 0);
				} else {
					this.renderer.setStyle(
						this.container.nativeElement,
						'width',
						`${this.content.nativeElement.clientWidth}px`
					);
				}
			}

			this.isOpen = !this.isOpen;
		}
	}
}

import { Component, ContentChild, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
	selector: 'app-flyout',
	templateUrl: './flyout.component.html',
	styleUrls: ['./flyout.component.scss']
})
export class FlyoutComponent implements OnInit {
	@ViewChild('flyoutContentContainer') container?: ElementRef;
	@ContentChild('flyoutContent') content?: ElementRef;

	@Input()
	label = '';

	@Input()
	placement: 'left' | 'right' | 'top' | 'bottom' = 'right';

	isOpen = false;

	constructor() {}

	ngOnInit() {}

	toggle() {
		if (this.content && this.container) {
			if (this.placement === 'top' || this.placement === 'bottom') {
				if (this.isOpen) {
					this.container.nativeElement.style.height = '0';
				} else {
					this.container.nativeElement.style.height =
						this.content.nativeElement.clientHeight + 'px';
				}
			} else {
				if (this.isOpen) {
					this.container.nativeElement.style.width = '0';
				} else {
					this.container.nativeElement.style.width =
						this.content.nativeElement.clientWidth + 'px';
				}
			}

			this.isOpen = !this.isOpen;
		}
	}
}

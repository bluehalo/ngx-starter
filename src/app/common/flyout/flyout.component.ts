import {
	Component,
	ContentChild,
	ElementRef,
	Input,
	OnInit,
	ViewChild
} from '@angular/core';

@Component({
	selector: 'app-flyout',
	templateUrl: './flyout.component.html',
	styleUrls: ['./flyout.component.scss']
})
export class FlyoutComponent implements OnInit {

	@ViewChild('flyoutContentContainer', { static: false }) container: ElementRef;
	@ContentChild('flyoutContent', { static: false}) content: ElementRef;

	@Input()
	label: string;

	isOpen = false;

	constructor() {
	}

	ngOnInit() {
	}

	toggle() {
		if (this.isOpen) {
			this.container.nativeElement.style.width = '0';
		} else {
			this.container.nativeElement.style.width = this.content.nativeElement.clientWidth + 'px';
		}

		this.isOpen = !this.isOpen;
	}

}

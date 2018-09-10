import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: [ 'navbar.component.scss' ]
})
export class NavbarComponent {

  navbarOpenValue = false;

  @Output()
  navbarOpenChange = new EventEmitter<boolean>();

  @Input()
  get navbarOpen() {
    return this.navbarOpenValue;
  }

  set navbarOpen(v: boolean) {
    this.navbarOpenValue = v;
    this.navbarOpenChange.emit(v);

    if (null != window) {
      window.dispatchEvent(new Event('resize', { bubbles: true }));
    }
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

}

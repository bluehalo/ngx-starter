import { Component } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: [ 'navbar.component.scss' ]
})
export class NavbarComponent {

  navbarOpen = true;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;

    if (null != window) {
      window.dispatchEvent(new Event('resize', { bubbles: true }));
    }
  }

}

import { Component } from '@angular/core';

@Component({
  selector: 'page-container',
  templateUrl: 'page-container.component.html',
  styleUrls: [ 'page-container.component.scss' ]
})
export class PageContainerComponent {

  // TODO: load the stuff from the server

  bannerContent = 'DEFAULT SETTINGS';
  copyrightContent = '&copy; 2018 - Asymmetrik, Ltd.';

}

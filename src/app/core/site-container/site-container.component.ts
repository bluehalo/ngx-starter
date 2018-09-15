import { Component } from '@angular/core';

@Component({
  selector: 'site-container',
  templateUrl: 'site-container.component.html',
  styleUrls: [ 'site-container.component.scss' ]
})
export class SiteContainerComponent {

  // TODO: load the stuff from the server

  bannerContent = 'DEFAULT SETTINGS';
  copyrightContent = '&copy; 2018 - Asymmetrik, Ltd.';

}

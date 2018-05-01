import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'PublicationsPage';
  tab2Root = 'PeoplePage';
  tab3Root = 'MessagesPage';
  tab4Root = 'ProfilePage';

  constructor() {

  }
}

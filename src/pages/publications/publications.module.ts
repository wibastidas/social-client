import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicationsPage } from './publications';
import { SharedModule } from '../../shared/shared.module';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    PublicationsPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicationsPage),
    SharedModule,
    MomentModule
  ],
})
export class PublicationsPageModule {}

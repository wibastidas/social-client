import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateMessagePage } from './create-message';

@NgModule({
  declarations: [
    CreateMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateMessagePage),
  ],
})
export class CreateMessagePageModule {}

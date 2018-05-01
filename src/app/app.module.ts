import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { PublicationsServiceProvider } from '../providers/publications-service/publications-service';
import { PeopleServiceProvider } from '../providers/people-service/people-service';
import { UploadProvider } from '../providers/upload/upload';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClientModule, 
    HttpClient,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiServiceProvider,
    UserServiceProvider,
    PublicationsServiceProvider,
    PeopleServiceProvider, 
    UploadProvider
  ]
})
export class AppModule {}

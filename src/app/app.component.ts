import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { ApiServiceProvider } from '../providers/api-service/api-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  @ViewChild(Nav) nav: Nav;


  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen, 
              public  userServiceProvider: UserServiceProvider, 
              public events: Events, 
              public apiServiceProvider: ApiServiceProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.inicializar();
      this.loginUser();
    });
  }


  inicializar(){
    console.log("inicializar app compone");
    this.events.subscribe('logOut:true', () => {
      this.nav.setRoot('LoginPage');
    });
  }

  loginUser(){ 
    this.userServiceProvider.getUserAndPass().then((userAndPass) => {
      //('res userAndPass: ', userAndPass);
      if(userAndPass){   
        
        this.userServiceProvider.login(userAndPass).then(userInfo => {
          //console.log('res userInfo: ', userInfo);

          this.gettoken(userAndPass);

        }).catch(err => {
          //console.error("err con los datos de autenticacion", err);   
          this.nav.setRoot('LoginPage');    
        });
      } else {
        this.nav.setRoot('LoginPage');
      }

    });
  }

  gettoken(userAndPass){

    this.userServiceProvider.login(userAndPass, "true").then(res => {

      //setteo las cabeceraz de autenticacion
      this.apiServiceProvider.setCredeentials(res.token);

      this.userServiceProvider.setToken(res.token);

      this.nav.setRoot('TabsPage');

      //conseguir los contadores o estadisticas
      //this.getCounters();
        
      }).catch(err => {
        console.error("Error obteniendo token", err);       
      });
  }
}

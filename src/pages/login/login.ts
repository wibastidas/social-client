import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Loading, Toast } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user';
//import { TabsPage } from '../tabs/tabs';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public user: User ;
  public token;
  public submitted = false;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public  userServiceProvider: UserServiceProvider, 
              public loading: LoadingController, 
              public toast: ToastController, 
              public apiServiceProvider: ApiServiceProvider) {
    this.user = new User;

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
  }

  onLogin(form: NgForm) {
    //console.log("onLogin");
    this.submitted = true;

    //console.log("this.user: ", this.user);    

    if (form.valid) {
      //console.log("form.valid");

      const loading = this.presentLoading();
      loading.present();

      this.userServiceProvider.login(this.user).then(res => {
        //console.log("res login", res); 

        //guardo el usuario y la clave
        this.userServiceProvider.setUserAndPass(this.user.email, this.user.password);

        //Guardo los datos del usuario devueltos
        this.userServiceProvider.setUserIdentity(res.user);

        /*
        this.userServiceProvider.getUserAndPass().then((userAndPass) => {
          if(userAndPass){
            console.log("userAndPass storage", userAndPass);    
          }
        });

        this.userServiceProvider.getUserIdentity().then((userIdentity) => {
          if(userIdentity){
            console.log("userIdentity storage", userIdentity);    
          }
        });*/

        this.gettoken();

        loading.dismissAll();  

      }).catch(err => {
        console.error("err con los datos de autenticacion", err);   
        loading.dismissAll();  
        let toast = this.presentToast("Datos de autenticación inválidos.", 1500, "top");
        toast.present();     
      });
    }
  }


  gettoken(){

    this.userServiceProvider.login(this.user, "true").then(res => {

        this.token = res.token;

        this.userServiceProvider.setToken(this.token);

        //setteo las cabeceraz de autenticacion
        this.apiServiceProvider.setCredeentials(this.token);

        //let toast = this.presentToast("Usuario identificado correctamente.", 1500, "top");
        //toast.present();
        this.navCtrl.setRoot('TabsPage');

        //conseguir los contadores o estadisticas
        //this.getCounters();
        
      }).catch(err => {
        console.error("Error obteniendo token", err);       
      });
  }

  presentLoading(): Loading {
    return this.loading.create({
      content: 'Cargando...',
      dismissOnPageChange: false
    });
  }

  presentToast(mensaje, duracion, position): Toast {
    return this.toast.create({
      message: mensaje,
      duration: duracion,
      position: position,
      showCloseButton: true,
      closeButtonText: 'x',
    });
  }

  onRegister(){
    this.navCtrl.push('RegisterPage');
  }

}

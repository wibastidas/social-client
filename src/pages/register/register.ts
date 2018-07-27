import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, MenuController, LoadingController, Loading, ToastController, Toast} from 'ionic-angular';
import { User } from '../../models/user';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  signup: User = { email: '', name: '', surname: '', nick: '', nacionalidad: '', password: '', role: 'ROLE_USER', image:''};
  submitted = false;

  constructor(public navCtrl: NavController, 
              public menu: MenuController, 
              public  userServiceProvider: UserServiceProvider, 
              public loading: LoadingController, 
              public toast: ToastController, 
              public apiServiceProvider: ApiServiceProvider) {
  }

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      const loading = this.presentLoading();
      loading.present();
      
      this.userServiceProvider.signup(this.signup).then(response => {
        if(response.user && response.user._id) {
          //console.log("Usuario registrado correctamente response", response);

          //guardo el usuario y la clave
          this.userServiceProvider.setUserAndPass(this.signup.email, this.signup.password);

          //Guardo los datos del usuario devueltos
          this.userServiceProvider.setUserIdentity(response.user);
          this.gettoken();

          loading.dismissAll();

        } else {
          //console.log("El registro no ha podido completarse, es posible que el email o el usuario ya este en uso");
          let toast = this.presentToast("El registro no ha podido completarse, es posible que el email o el usuario ya este en uso.", 9000, "top");
          toast.present();
          loading.dismissAll();
        }
      }).catch(error => {
        console.log("error", error);
        loading.dismissAll();
      });
    }

  }

  gettoken(){

    this.userServiceProvider.login(this.signup, "true").then(res => {

        this.userServiceProvider.setToken(res.token);

        //setteo las cabeceraz de autenticacion
        this.apiServiceProvider.setCredeentials(res.token);


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


}

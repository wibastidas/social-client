import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, Toast, Events } from 'ionic-angular';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { Message } from '../../models/message';
import { User } from '../../models/user';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { PeopleServiceProvider } from '../../providers/people-service/people-service';

@IonicPage()
@Component({
  selector: 'page-create-message',
  templateUrl: 'create-message.html',
})
export class CreateMessagePage {
  public message: Message;
  public userIdentity: User;
  public follows;
  public gaming: string;
  public text: string;
  public receiver: string;
  public habilitarEnviarMensaje: boolean = false;

  

  constructor(public navCtrl: NavController, 
              public viewCtrl: ViewController, 
              public navParams: NavParams, 
              public toast: ToastController,
              public peopleServiceProvider: PeopleServiceProvider, 
              public userServiceProvider: UserServiceProvider, 
              public messageServiceProvider : MessageServiceProvider, 
              public events: Events) {

    this.obtenerUsuarioLogeado();
    this.getMyFollows();
  }
  

  obtenerUsuarioLogeado(){
    this.userServiceProvider.getUserIdentity().then((userIdentity) => {
      this.userIdentity = userIdentity;
    });
  }

  getMyFollows(){
    this.peopleServiceProvider.getMyFollows().then(response => {
      this.follows = response.follows;
    }).catch(error => {
      console.log("error: ", error);
    });
  }

  cambioTextSelect(){

    if(this.text && this.text != "" && this.text != null){
      this.habilitarEnviarMensaje = true;
    } else {
      this.habilitarEnviarMensaje = false;
    }
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  enviar(){

    if(this.text && this.text != "" && this.text != null && this.receiver){

      this.message = {
        _id: '',
        text: this.text,
        viewed: '',  
        created_at: '', 
        emmiter: this.userIdentity._id.toString(), 
        receiver: this.receiver
      };
      this.enviarMensaje();
    }
  }

  enviarMensaje(){
    this.messageServiceProvider.addMessage(this.message).then(res =>{

      let mensaje: string = "Mensaje enviado!";
      let toast = this.presentToast(mensaje, 2000, "top");
      toast.present();
      this.events.publish('mensaje:enviado');
      this.dismiss();

    }).catch(err => {
      let mensaje: string = "A ocurrido un error en la aplicación!";
      let toast = this.presentToast(mensaje, 2000, "top");
      toast.present();
      console.log("err enviarMensaje", err);

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

  ionViewWillLeave(){
    this.events.unsubscribe('mensaje:enviado');
  }

}

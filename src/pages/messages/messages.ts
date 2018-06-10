import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { Message } from '../../models/message';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { GLOBAL } from '../../providers/global';

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  public mensajesType: string = "recibidos";
  public messagesRecibidos = [];
  public messagesEnviados = [];
  public url: string;
  public pageRecibidos: number;
  public pageEnviados: number;
  public pagesRecibidos: number;
  public pagesEnviados: number;
  public total: number;
  public refresher;

  constructor(public navCtrl: NavController, 
              public modalCtrl: ModalController, 
              public navParams: NavParams, 
              public messageServiceProvider : MessageServiceProvider, 
              public events: Events) {

    this.url = GLOBAL.url;
    this.pageRecibidos = 1;
    this.pageEnviados = 1;
    this.getMessagesRecibidos(this.pageRecibidos);
    this.getMessagesEnviados(this.pageEnviados);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }

  goToCreateMessage(){
    console.log("goToCreateMessage");
    let modal = this.modalCtrl.create('CreateMessagePage');
    modal.present();  

    this.events.subscribe('mensaje:enviado', (user) => {
      this.mensajesType = "enviados";
      this.messagesEnviados = [];
      this.getMessagesEnviados(1);
    });
  }

  getMessagesEnviados(page){
    this.messageServiceProvider.getMessagesEnviados(page).then(res => {
      console.log("res get messages: ", res);
      //this.messages = res.messages;

      for (let i = 0; i < res.messages.length; i++) {
        let message = {
          '_id': res.messages[i]._id,
          'text': res.messages[i].text,
          'viewed': "",
          'created_at': res.messages[i].created_at,
          'emmiter': res.messages[i].emmiter, 
          'receiver': res.messages[i].receiver,
          'urlImage': this.url + 'get-image-user/' + res.messages[i].emmiter.image
        };

        this.messagesEnviados.push(message);

      }

      this.pagesEnviados = res.pages;
      if(this.refresher){ 
        this.refresher.complete();
      }
    }).catch(err => {
      console.log("err: ", err);
      if(this.refresher){ 
        this.refresher.complete();
      }
    });
  }


  getMessagesRecibidos(page){
    this.messageServiceProvider.getMessagesRecibidos(page).then(res => {
      console.log("res get messages: ", res);
      //this.messages = res.messages;

      for (let i = 0; i < res.messages.length; i++) {
        let message = {
          '_id': res.messages[i]._id,
          'text': res.messages[i].text,
          'viewed': "",
          'created_at': res.messages[i].created_at,
          'emmiter': res.messages[i].emmiter, 
          'receiver': res.messages[i].receiver,
          'urlImage': this.url + 'get-image-user/' + res.messages[i].emmiter.image
        };

        this.messagesRecibidos.push(message);

      }
      this.pagesRecibidos = res.pages;
      if(this.refresher){ 
        this.refresher.complete();
      }
      
    }).catch(err => {
      console.log("err: ", err);
      if(this.refresher){ 
        this.refresher.complete();
      }
    });
  }

  doInfinite(infiniteScroll) {
    console.log("doInfinite: ", infiniteScroll);
    setTimeout(() => {
      if(this.mensajesType == "recibidos"){
        this.pageRecibidos += 1;
        this.getMessagesRecibidos(this.pageRecibidos); 
        infiniteScroll.complete();
      } else {
        this.pageEnviados += 1;
        this.getMessagesEnviados(this.pageEnviados); 
        infiniteScroll.complete();
      }

    }, 2000);
  }

  doRefresh(refresher) {
    this.refresher = refresher;

    if(this.mensajesType == "recibidos"){
      this.messagesRecibidos = [];
      this.pageRecibidos = 1;
      this.getMessagesRecibidos(this.pageRecibidos);
    } else {
      this.messagesEnviados = [];
      this.pageEnviados = 1;
      this.getMessagesEnviados(this.pageEnviados);
    }
  }

}

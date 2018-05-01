import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, ModalController, Events } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { Storage } from '@ionic/storage';
import { GLOBAL } from '../../providers/global';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user';
import { PeopleServiceProvider } from '../../providers/people-service/people-service';
import { PublicationsServiceProvider } from '../../providers/publications-service/publications-service';
import { App } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userIdParams: number;
  public url: string;
  public userIdentity: User;
  public userIdLogeado: number;
  public name: string;
  public surname: string;
  public nick: string;
  public following: number = 0 ;
  public followed: number = 0;
  public publications: number = 0;
  public urlImage;
  public mostrarEditUSer: boolean;
  public meSigue: boolean = false;
  public loSigo: boolean = false;
  public page: number;
  public pages: number;
  public total: number;
  public publicationsUser = [];
  public refresher;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public apiServiceProvider: ApiServiceProvider, 
              public storage: Storage, 
              public userServiceProvider: UserServiceProvider, 
              public peopleServiceProvider: PeopleServiceProvider, 
              public publicationsServiceProvider: PublicationsServiceProvider, 
              public actionSheetCtrl: ActionSheetController, 
              public platform: Platform, 
              public events: Events, 
              public modalCtrl: ModalController, 
              public appCtrl: App) {
    this.url = GLOBAL.url;

    this.userIdParams = navParams.get('user_id');
    //console.log("this.userId: ", this.userIdParams);

    this.userServiceProvider.getUserIdentity().then((userIdentity) => {
      //console.log("identity profile ");
      if(userIdentity){ 
        this.userIdentity = userIdentity;
        this.userIdLogeado = userIdentity._id;
        this.inicializarUsuario(userIdentity);
      }
    });
  }

  recargarDatosUsr(user){
    this.userIdentity = user;
    this.userIdLogeado = user._id;
    this.inicializarUsuario(user);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ProfilePage');
    this.events.subscribe('follow:unFollow', () => {
      //console.log('subscribe ev follow:unFollow');
      this.getCounters();
    });

    this.events.subscribe('update:user', (user) => {
      //console.log('subscribe update user', user);
      this.recargarDatosUsr(user);
    });
  }

  inicializarUsuario(userIdentity){

      if(!this.userIdParams || this.userIdLogeado  == this.userIdParams){
        
       // console.log("es el mismo usuario logueado");

        if(this.userIdentity){
          var  image = this.userIdentity.image;
          this.name = userIdentity.name;
          this.surname = userIdentity.surname;
          this.nick = userIdentity.nick;
        }

        this.mostrarEditUSer = true;
        this.urlImage = this.url + 'get-image-user/' + image;    
        this.getCounters();
        this.cargarPublicaciones();

      } else {
        this.mostrarEditUSer = false;
        this.getUser();
        this.getCounters();
        this.cargarPublicaciones();
      }
    
  }

  cerrarSesion(){
    this.apiServiceProvider.removeCredeentials();
    this.storage.remove('usrAndPass');
    this.storage.remove('userIdentity');
    this.events.publish('logOut:true');

  }

  getCounters(){
    let userId;
    if(this.userIdParams){
      userId = this.userIdParams;
    } else {
      userId = this.userIdLogeado;
    }

    this.peopleServiceProvider.getCounters(userId).then(stats => {
      //console.log("getCounters response: ", stats);
      if(stats){
        this.following = stats.following;
        this.followed = stats.followed;
        this.publications = stats.publications;
      }
    }).catch( error => {
      console.log("error", error);
    });
  }

  getUser(){
    this.peopleServiceProvider.getUser(this.userIdParams).then(response => {
      //console.log("response", response);
      if(response.user){
        this.urlImage = this.url + 'get-image-user/' + response.user.image;    
        this.name = response.user.name;
        this.surname = response.user.surname;
        this.nick = response.user.nick;

        //Compruebo si estoy siguiendo al usuario
        if(response.following && response.following._id){
          this.loSigo = true;
        } else {
          this.loSigo = false;
        }

        //Compruebo el usuario me sigue no lo estoy usando
        if(response.followed && response.followed._id){
          this.meSigue = true;
        } else {
          this.meSigue = false;
        }
      }
    }).catch( error => {
      console.log("error", error);
    });
  }

  cargarPublicaciones(){
    this.page = 1;
    this.getPublicationsUser(this.page);
  }

  getPublicationsUser(page){
    //console.log("getPublicationsUser");

    let userId;
    if(this.userIdParams){
      userId = this.userIdParams;
    } else {
      userId = this.userIdLogeado;
    }

    //console.log("userId: ", userId);

    this.publicationsServiceProvider.getPublicationsUser(page, userId).then(response => {
      //console.log("publications: ", response);

      this.pages = response.pages;
      this.total = response.total_items;

      if(response.publications){
        for (let i = 0; i < response.publications.length; i++) {
          let publication = {
            'name': response.publications[i].user.name,
            'surname': response.publications[i].user.surname,
            'nick': response.publications[i].user.nick,
            'text': response.publications[i].text,
            'file': response.publications[i].file, 
            'fileUrl': this.url + 'get-image-pub/' + response.publications[i].file,
            'urlImage': this.url + 'get-image-user/' + response.publications[i].user.image,
            'created_at': response.publications[i].created_at, 
            'userId': response.publications[i].user._id,
            'publicationId': response.publications[i]._id,

          };

          this.publicationsUser.push(publication);
          if(this.refresher){ 
            this.refresher.complete();
          }
        }
      }
    }).catch(error => {
      console.log("error", error);
      if(this.refresher){
        this.refresher.complete();
      }
    });
  } 

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.page += 1;
      infiniteScroll.complete();
    }, 2000);
    this.getPublicationsUser(this.page);
  }

  goToProfileUser(userId){
    this.navCtrl.push('ProfilePage', {user_id: userId});
  }

  goToOptionsPublication(publication_id){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Publicacion',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.eliminarPublicacion(publication_id);
            //console.log('Delete clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  goToOptions(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Cerrar Sesión',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.cerrarSesion();
           // console.log('Cerrar clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  eliminarPublicacion(publication_id){
    //console.log("eliminar", publication_id);
    this.publicationsServiceProvider.deletePublication(publication_id).then(response => {
      //console.log("response: ",response);
      this.publicationsUser = [];
      this.page = 1;
      this.getPublicationsUser(this.page);
    }).catch(err =>{
      console.log("err: ",err);
    });
  }


  followUser(){ 
    let follow = {
      '_id': '',
      'user': this.userIdentity._id,   
      'followed': this.userIdParams
    }

    this.peopleServiceProvider.addFollow(follow).then(response => {
      //console.log("response: ", response);
      this.loSigo = true;
      this.getCounters();
    }).catch(error => {
      console.log("err", error);
    });
  }

  unFollowUser(){
    this.peopleServiceProvider.deleteFollow(this.userIdParams).then(response => {
      //console.log("response: ", response);
      this.loSigo = false;
      this.getCounters();
    }).catch(error => {
      console.log("err", error);
    });
  }

  getFollowing(){
    //console.log("getFollowing()");
    if(this.following > 0){

    
    let userId;
    if(this.userIdParams){
      userId = this.userIdParams;
    } else {
      userId = this.userIdLogeado;
    }

    let modal = this.modalCtrl.create('FollowPage', {page_action: 'Seguidos', user_id: userId});
    modal.present();
    }
  }

  getFollowed(){
    //console.log("getFollowed()");
    if(this.followed > 0){
      let userId;
      if(this.userIdParams){
        userId = this.userIdParams;
      } else {
        userId = this.userIdLogeado;
      }
  
      let modal = this.modalCtrl.create('FollowPage', {page_action: 'Seguidores', user_id: userId});
      modal.present();
    }
  }

  goEditProfile(){
    this.navCtrl.push('EditProfilePage');
  }

}
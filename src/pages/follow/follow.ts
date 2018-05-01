import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, Platform, Events } from 'ionic-angular';
import { GLOBAL } from '../../providers/global';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user';
import { PeopleServiceProvider } from '../../providers/people-service/people-service';

@IonicPage()
@Component({
  selector: 'page-follow',
  templateUrl: 'follow.html',
})
export class FollowPage {
  public url: string;
  public userIdParams: number;
  public pageAction: string;
  public userIdLogeado: number;
  public userIdentity: User;
  public users: any[];
  public page: number;
  public pages: number;
  public total: number;
  public follows;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public peopleServiceProvider: PeopleServiceProvider, 
              public userServiceProvider: UserServiceProvider, 
              public actionSheetCtrl: ActionSheetController, 
              public platform: Platform, 
              public viewCtrl: ViewController, 
              public events: Events) {

    this.url = GLOBAL.url;

    this.userIdParams = navParams.get('user_id');
    //console.log("this.userId: ", this.userIdParams);

    this.pageAction = navParams.get('page_action');

    this.inicializarUsuario();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad FollowPage');
  }

  inicializarUsuario(){
    this.userServiceProvider.getUserIdentity().then((userIdentity) => {
      //console.log("userIdentity profile ");
      if(userIdentity){ 
        this.userIdentity = userIdentity;
        this.userIdLogeado = userIdentity._id;
      }
    });

    this.users = [];

    if(this.pageAction == 'Seguidos'){
      this.cargarFollowing()
    } else if (this.pageAction == 'Seguidores'){
      this.cargarFollowed();
    } else {
      //console.log("No es following ni followed");
    }
  }

  cargarFollowing(){
    this.page = 1;
    this.getFollowing(this.page);
  }

  cargarFollowed(){
    this.page = 1;
    this.getFollowed(this.page);
  }

  getFollowing(page){
    this.peopleServiceProvider.getFollowing(this.userIdParams, page).then(response => {
      this.follows = response.users_followig;
      this.pages = response.pages;
      this.total = response.total;

      if(response.follows){
        for (let i = 0; i < response.follows.length; i++) {
          let user = {
            'name': response.follows[i].followed.name,
            'surname': response.follows[i].followed.surname,
            'nick': response.follows[i].followed.nick,
            'email': response.follows[i].followed.email,
            '_id': response.follows[i].followed._id, 
            'image': this.url + 'get-image-user/' + response.follows[i].followed.image 
          }
          this.users.push(user);
        }
      }
    }).catch(error => {
      console.log("error: ", error);
    });
  }

  getFollowed(page){
    this.peopleServiceProvider.getFollowed(this.userIdParams, page).then(response => {
      this.follows = response.users_followig;
      this.pages = response.pages;
      this.total = response.total;

      if(response.follows){
        for (let i = 0; i < response.follows.length; i++) {
          let user = {
            'name': response.follows[i].user.name,
            'surname': response.follows[i].user.surname,
            'nick': response.follows[i].user.nick,
            'email': response.follows[i].user.email,
            '_id': response.follows[i].user._id, 
            'image': this.url + 'get-image-user/' + response.follows[i].user.image 
          }
          this.users.push(user);
        }
      }
    }).catch(error => {
      console.log("error: ", error);
    });
  }

  followUser(followed){
    let follow = {
      '_id': '',
      'user': this.userIdParams,  
      'followed': followed
    }

    this.peopleServiceProvider.addFollow(follow).then(response => {
      //console.log("response: ", response);
      this.follows.push(followed);
      this.events.publish('follow:unFollow');
      //this.getCounters();
    }).catch(error => {
      console.log("err", error);
    });
  }

  goToUnFollowUser(followed){

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.unFollowUser(followed);
            //console.log('Delete clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  unFollowUser(followed){
    this.peopleServiceProvider.deleteFollow(followed).then(response => {
      
      //console.log("response unFollowUser: ", response);
      let search = this.follows.indexOf(followed);
      if(search != -1){
        this.follows.splice(search, 1);
      }
      this.events.publish('follow:unFollow');

    }).catch(error => {
      console.log("response", error);
    });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.page += 1;
      this.getFollowing(this.page); 
      infiniteScroll.complete();
    }, 2000);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  goToProfileUser(userId){
    this.navCtrl.push('ProfilePage', {user_id: userId});
  }

}

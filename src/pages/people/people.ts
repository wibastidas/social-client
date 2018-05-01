import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { PeopleServiceProvider } from '../../providers/people-service/people-service';
import { GLOBAL } from '../../providers/global';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-people',
  templateUrl: 'people.html',
})
export class PeoplePage {
  public pages: number;
  public total: number;
  public users: any[];
  public follows;
  public url: string;
  public userIdentity: User;
  public page: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public peopleServiceProvider: PeopleServiceProvider,
              public  userServiceProvider: UserServiceProvider, 
              public events: Events) {
    this.url = GLOBAL.url;

    this.userServiceProvider.getUserIdentity().then((userIdentity) => {
      if(userIdentity){
        //console.log("userIdentity storage", userIdentity);  
        this.userIdentity = userIdentity;
        this.cargarUsuarios();
      }
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PeoplePage');
  }

  cargarUsuarios(){
    this.users = []; 
    this.page = 1;
    this.getAllUsers(this.page);
  }

  getAllUsers(page: number){

    this.peopleServiceProvider.getUsers(page).then(response => {
      //console.log("response: ", response);

      this.follows = response.users_followig;
      this.pages = response.pages;
      this.total = response.total;

      //console.log("this.follows",this.follows);

      if(response.users){
        for (let i = 0; i < response.users.length; i++) {
          let user = {
            'name': response.users[i].name,
            'surname': response.users[i].surname,
            'nick': response.users[i].nick,
            'email': response.users[i].email,
            '_id': response.users[i]._id, 
            'image': this.url + 'get-image-user/' + response.users[i].image 
          }

          if(user._id != this.userIdentity._id){
            this.users.push(user);
          }

          //console.log("this.users",this.users);

        }
      }
    }).catch(err => {
      console.log("error: ", err)
    });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.page += 1;
      this.getAllUsers(this.page);
      infiniteScroll.complete();
    }, 2000);
  }

  followUser(followed){
    //console.log("followUser", followed);
    let follow = {
      '_id': '',
      'user': this.userIdentity._id,   
      'followed': followed
    }

    this.peopleServiceProvider.addFollow(follow).then(response => {
      //console.log("response: ", response);
      this.follows.push(followed);
      this.events.publish('follow:unFollow');

      //this.getCounters();
    }).catch(error => {
      console.log("error", error);
    });
  }

  unFollowUser(followed){
    this.peopleServiceProvider.deleteFollow(followed).then(response => {
      //console.log("response: ", response);
      let search = this.follows.indexOf(followed);
      if(search != -1){
        this.follows.splice(search, 1);
      }
      this.events.publish('follow:unFollow');
      //this.getCounters();
    }).catch(error => {
      console.log("error", error);
    });
  }

  goToProfileUser(userId){
    //console.log("userId people : ", userId);
    this.navCtrl.push('ProfilePage', {user_id: userId});
  }
  

}

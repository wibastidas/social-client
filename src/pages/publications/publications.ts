import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { GLOBAL } from '../../providers/global';
import { PublicationsServiceProvider } from '../../providers/publications-service/publications-service';

@IonicPage()
@Component({
  selector: 'page-publications',
  templateUrl: 'publications.html',
})
export class PublicationsPage {
  public page: number;
  public pages: number;
  public total: number;
  public publications = [];
  public url: string;
  public refresher;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController, 
              public events: Events, 
              public publicationsServiceProvider:PublicationsServiceProvider) {
    this.url = GLOBAL.url;
    this.inicializar();
  }

  inicializar(){
    this.events.subscribe('publication:new', () => {
      this.publications = [];
      this.cargarPublicaciones();    
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PublicationsPage');
    this.cargarPublicaciones();

  }

  ionViewWillEnter() {
    //console.log("ionViewWillEnter");
    //this.cargarPublicaciones();
  }

  cargarPublicaciones(){
    //console.log("cargarPublicaciones");
    this.page = 1;
    //this.infiniteScroll.enable(true);
    this.getAllPublications(this.page);
  }

  getAllPublications(page){
    //console.log("getAllPublications", page);


    this.publicationsServiceProvider.getPublications(page).then((response) => {
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

          };


          this.publications.push(publication);
          if(this.refresher){ 
            this.refresher.complete();
          }
        }
      }
    }).catch((error) => {
      console.log("error", error);
      if(this.refresher){
        this.refresher.complete();
      }
    });
  }

  doRefresh(refresher) {
    this.publications = [];
    //console.log("doRefresh");
    this.refresher = refresher;
    this.cargarPublicaciones();
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.page += 1;
      infiniteScroll.complete();
    }, 2000);
    this.getAllPublications(this.page);
  }

  goToProfileUser(userId){
    this.navCtrl.push('ProfilePage', {user_id: userId});
  }

  goToPublication() {
    console.log("goToPublication");
    let modal = this.modalCtrl.create('PublicationPage');
    modal.present();  }

}

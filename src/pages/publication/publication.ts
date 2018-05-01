import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { GLOBAL } from '../../providers/global';
import { User } from '../../models/user';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Publication } from '../../models/publication';
import { PublicationsServiceProvider } from '../../providers/publications-service/publications-service';
import { UploadProvider } from '../../providers/upload/upload';

@IonicPage()
@Component({
  selector: 'page-publication',
  templateUrl: 'publication.html',
})
export class PublicationPage {
  public url: string;
  public userIdentity: User;
  public urlImage;
  public publication: Publication;
  public text: string;
  public habilitarEnviarPublicacion: boolean = false;
  public filesToUpload : Array<File>;
  public urlImagePublication: string;
  public adjuntoImagen: boolean = false;
  public token: string;

  constructor(public navCtrl: NavController, 
              public viewCtrl: ViewController, 
              public events: Events, 
              public userServiceProvider: UserServiceProvider, 
              public publicationsServiceProvider: PublicationsServiceProvider, 
              public uploadProvider: UploadProvider,
              public navParams: NavParams) {
    this.url = GLOBAL.url;
    this.obtenerUsuarioLogeado();
    this.obtenerTokenUser();
  }

  obtenerUsuarioLogeado(){
    this.userServiceProvider.getUserIdentity().then((userIdentity) => {
      //console.log("identity profile ");
      if(userIdentity){ 
        this.userIdentity = userIdentity;
        this.urlImage = this.url + 'get-image-user/' + userIdentity.image;
      }
    });
  }

  obtenerTokenUser(){
    this.userServiceProvider.getToken().then((token) => {
      this.token = token;
    });
  }

  onSubmit(){
    this.publication = { 
      '_id': "",
      'text': this.text,
      'file': this.filesToUpload, 
      'created_at':"", 
      'user':this.userIdentity._id
    };

    this.publicationsServiceProvider.addPublication(this.publication).then(response => {
        console.log("publicationProvider response: ", response);
        if(response.publication){
          this.publication = response.publication; 

          if(this.adjuntoImagen ){
            //SUBIDA DE IMAGEN
            this.uploadProvider.mikeFileRequest(this.url+'upload-image-pub/'+response.publication._id, this.filesToUpload, 'image', this.token)
                                .then((result: any)=> {
                                  console.log("result publi file: ", result);
                                  this.publication.file = result.image;
                                  this.events.publish('publication:new');
                                });
            this.navCtrl.setRoot('TabsPage'); 

          } else {
            this.navCtrl.setRoot('TabsPage'); 
          }

        } else {
          console.log("fallo", response)
        }
    }).catch(error => {
      console.log("error: ", error);
    });
  }

  cambioText(){
    if(this.text && this.text != "" && this.text != null ){
      this.habilitarEnviarPublicacion = true;
    } else {
      this.habilitarEnviarPublicacion = false;
    }
  }

  fileChangeEvent(event){
    this.filesToUpload = <Array<File>>event.target.files;

    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.urlImagePublication = event.target.result;
        this.habilitarEnviarPublicacion = true;
        this.adjuntoImagen = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
      let fileList: FileList = event.target.files;  
      let file: File = fileList[0];
      console.log(file);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Events, ViewController, Loading, Toast } from 'ionic-angular';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { UploadProvider } from '../../providers/upload/upload';
import { GLOBAL } from '../../providers/global';
import { User } from '../../models/user';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  username: string;
  public url: string;
  public name = '';
  public surname = '';
  public nick = '';
  public email = '';
  public userID ;
  public imagen;
  public urlImage;
  public modificarUsuario: FormGroup;
  public habilitarGuardarCambios:boolean = false; 
  public filesToUpload : Array<File>;
  public adjuntoImagen: boolean = false;
  public userIdentity: User;
  
  constructor(public alertCtrl: AlertController,  
              public nav: NavController, 
              public userServiceProvider: UserServiceProvider, 
              public loading: LoadingController, 
              public toast: ToastController,
              public formBuilder: FormBuilder, 
              public uploadProvider: UploadProvider, 
              public events: Events,
              public storage: Storage, 
              public viewCtrl: ViewController) {
    this.url = GLOBAL.url;

    this.inicializarUsuario();
  }

  inicializarUsuario(){

    this.modificarUsuario = this.formBuilder.group({
      name: [this.name, Validators.required ],  
      surname: [this.surname, Validators.required],
      nick: [this.nick, Validators.required],
      email: ['', Validators.compose([Validators.required, GlobalValidator.mailFormat])],
    });

    this.userServiceProvider.getUserIdentity().then((userIdentity) => {
      //console.log("identity profile ", userIdentity);
      if(userIdentity){ 
        this.userIdentity = userIdentity;
        this.name = userIdentity.name;
        this.surname = userIdentity.surname;
        this.nick = userIdentity.nick;
        this.email = userIdentity.email;
        this.userID = userIdentity._id;
        this.imagen = userIdentity.image;
        this.urlImage = this.url + 'get-image-user/' + this.imagen;
      }
    });
  }

  onUpdate(){
    const loading = this.presentLoading();
    loading.present();

    let usuario = {
      'name': this.name,
      'surname': this.surname,
      'nick': this.nick,
      'email': this.email,
      '_id': this.userID,
    }

    this.userServiceProvider.updateUser(usuario).then(response => {
      if(!response.user){
        let mensaje: string = "El nick o email ya está en uso!";
        let toast = this.presentToast(mensaje, 2000, "top");
        toast.present();
        loading.dismissAll();
      } else {
        let mensaje: string = "Usuario modificado!";
        //let toast = this.presentToast(mensaje, 2000, "top");
        //toast.present();
        this.habilitarGuardarCambios = false;
        this.userServiceProvider.setUserIdentity(response.user); 
        loading.dismissAll();
        this.dismiss();

        let user = response.user;
        //console.log("MODIFICADO: ", user);
        this.events.publish('update:user', user );

        
        if(this.adjuntoImagen ){

          this.userServiceProvider.getToken().then((token) => {
              //SUBIDA DE IMAGEN
              this.uploadProvider.mikeFileRequest(this.url+'upload-image-user/'+response.user._id, this.filesToUpload, 'image', token)
              .then((result: any) => {

                let userIdentity = result.user;
                //console.log("MODIFICADO foto: ", userIdentity);
                this.storage.set('userIdentity', userIdentity).then(() => {
                  this.events.publish('update:user', (userIdentity));

                });
              });

          });
        }

      }
    }).catch(error => {
      console.log("error", error);
      loading.dismissAll();
      this.dismiss();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
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

  cambioForm(){
    if(this.modificarUsuario.valid){
      this.habilitarGuardarCambios = true;        
    } else {
      this.habilitarGuardarCambios = false;  
    }
  }

  fileChangeEvent(event){
    this.habilitarGuardarCambios = true; 
    this.filesToUpload = <Array<File>>event.target.files;

    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.urlImage = event.target.result;
        this.adjuntoImagen = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
      let fileList: FileList = event.target.files;  
      let file: File = fileList[0];
      //console.log(file);
  }

}




export class GlobalValidator {
  
  static passwordFormat(control: AbstractControl): ValidationResult {

    if (control.value != '' && control.value.length < 8) {
      return {'incorrectMailFormat': true};
    }

    return null;
  }

  static mailFormat(control: AbstractControl): ValidationResult {

    const EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    if (control.value != '' && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return {'incorrectMailFormat': true};
    }

    return null;
  }

  static telefonoFormat(control: AbstractControl): ValidationResult {

    //const TELEFONO_REGEXP = /^[0-9]$/;

    if (isNaN(control.value)) {
        return {'incorrectCelFormat': true};

    }

    return null;
  }

 
  static textFormat(control: AbstractControl): ValidationResult {

    const TEXT_REGEXP = /^[a-zA-Z áéíóúÁÉÍÓÚñÑ]*$/;

    if (control.value != '' && !TEXT_REGEXP.test(control.value)) {
      return {'incorrectMailFormat': true};
    }

    return null;
  }

}

export interface ValidationResult {
  [key: string]: boolean;
}
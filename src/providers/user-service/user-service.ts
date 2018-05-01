import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { ApiServiceProvider } from '../api-service/api-service';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserServiceProvider {

  constructor(public http: HttpClient, 
              public apiServiceProvider: ApiServiceProvider, 
              public storage: Storage) {
    //console.log('Hello UserServiceProvider Provider');
  }

  login(user: User, gettoken = null): Promise<any> {
    if(gettoken){
      user.gettoken = gettoken;  
    }
    return this.apiServiceProvider.post('login' , user);
  }

  setUserAndPass(usuario, pass) { 
    let usuarioLogeado = { 'email': usuario, 'password': pass }
    this.storage.set("usrAndPass", usuarioLogeado)
  }

  getUserAndPass() {
      return this.storage.get("usrAndPass")
  }

  removeUserAndPass() {
    this.storage.remove("usrAndPass");
  }

  //Almacena los datos del usuario logeado
  setUserIdentity(user: User): void {
    this.storage.set('userIdentity', user).then(() => {
      //this.events.publish('update:user');
      //console.log("setUserIdentity");
    });
  };

  //Devuelve los datos del usuario logeado
  getUserIdentity(): Promise<User> {
    return this.storage.get('userIdentity').then((value) => {
      return value;
    });
  };
  
  updateUser(user): Promise<any> { 

    return this.apiServiceProvider.put('update-user/' + user._id , user);
  }

  //Almaceno el token del usuario logeado
  setToken(token: String): void {
    this.storage.set('token', token);
  };

  //Devuelve el token del usuario logeado
  getToken(): Promise<string> {
    return this.storage.get('token').then((value) => {
      return value;
    });
  };

  signup(user: User): Promise<any> {
    return this.apiServiceProvider.post('register' , user);
  }

  

}

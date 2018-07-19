import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiServiceProvider } from '../api-service/api-service';

@Injectable()
export class PeopleServiceProvider {

  constructor(public http: HttpClient, 
              public apiServiceProvider: ApiServiceProvider) {
    //console.log('Hello PeopleServiceProvider Provider');
  }

  //obtener Usuarios
  getUsers(page = null): Promise<any> { 

    return this.apiServiceProvider.get('users/'+page);
  }

  //Devuelve las cantidades de following, followed y publicaciones del usuar 
  getCounters(userId = null): Promise<any>{
    //console.log("getCounters userId", userId);
    if(userId != null){
      return this.apiServiceProvider.get('counters/' + userId);
    } else {
      return this.apiServiceProvider.get('counters/');
    }
  }

  addFollow(follow): Promise<any> {  

    return this.apiServiceProvider.post('follow/', follow);
  }

  deleteFollow(id): Promise<any> {   
 
    return this.apiServiceProvider.delete('follow/'+ id);
  }  

  getUser(id): Promise<any> { 

    return this.apiServiceProvider.get('user/'+id);
  }

  //usuarios que sigo
  getFollowing(userId, page = 1): Promise<any> { 

    return this.apiServiceProvider.get('following/'+ userId + '/'+ page);
  }

  //usuarios que sigo
  getFollowed(userId, page = 1): Promise<any> { 

    return this.apiServiceProvider.get('followed/'+ userId + '/'+ page);
  }

  //usuarios que sigo
  getMyFollows(): Promise<any> { 

    return this.apiServiceProvider.get('get-my-follows/true');
  } 

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiServiceProvider } from '../api-service/api-service';
import { Publication } from '../../models/publication';

@Injectable()
export class PublicationsServiceProvider {

  constructor(public http: HttpClient, 
              public apiServiceProvider: ApiServiceProvider) {
    //console.log('Hello PublicationsServiceProvider Provider');
  }

  getPublications(page = 1): Promise<any> { 

    return this.apiServiceProvider.get('publications/' + page);
  }

  getPublicationsUser(page = 1, user_id) : Promise<any>{

    return this.apiServiceProvider.get('publications-user/' + user_id + '/' + page);
  }

  deletePublication(id): Promise<any> { 
    //console.log("eliminar publicacion ");
    return this.apiServiceProvider.delete('publication/' + id);
  }

  addPublication(publication: Publication): Promise<any> { 

    return this.apiServiceProvider.post('publication/', publication);
  }

}

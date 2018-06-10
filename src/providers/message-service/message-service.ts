import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../../models/message';
import { ApiServiceProvider } from '../api-service/api-service';

@Injectable()
export class MessageServiceProvider {

  constructor(public http: HttpClient, 
              public apiServiceProvider: ApiServiceProvider) {
    console.log('Hello MessageServiceProvider Provider');
  }

  addMessage(message: Message): Promise<any> { 

    return this.apiServiceProvider.post('message/', message);
  }

  getMessagesRecibidos(page = 1): Promise<any> { 

    return this.apiServiceProvider.get('my-messages/' + page);
  }

  getMessagesEnviados(page = 1): Promise<any> { 

    return this.apiServiceProvider.get('messages/' + page);
  }

}

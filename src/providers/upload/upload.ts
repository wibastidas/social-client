import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { GLOBAL } from '../global';

@Injectable()
export class UploadProvider {

  public token: string;

  constructor(public http: HttpClient) {
    //console.log('Hello UploadProvider Provider');
  }

  mikeFileRequest(url: string, files: Array<File>, name: string, token){
    return new Promise((resolve, reject)=>{
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();

      for(let i = 0; i < files.length; i++){
        formData.append(name, files[i], files[i].name);
      }

      xhr.onreadystatechange = () => { 
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response))
          } else {
            reject(xhr.response)
          }
        }
      }

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token)
      xhr.send(formData);

    });
  }

}

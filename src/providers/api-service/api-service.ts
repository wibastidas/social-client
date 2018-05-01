import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './../global'

@Injectable()
export class ApiServiceProvider {

  static URL_BASE = GLOBAL.url;

  headers: HttpHeaders = new HttpHeaders();

  private static handleError(error: Response): Promise<any> {
    return Promise.reject(error);
  }

  constructor(public http: HttpClient) {
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('Accept', 'application/json');
  }

  setCredeentials(token: string) {
    this.headers = this.headers.set('Authorization', token);
  }

  removeCredeentials() {
    this.headers = this.headers.delete('Authorization');
  }

  private getURL(path: string) {
    return `${ApiServiceProvider.URL_BASE}${path}`;
  }

  public get(path: string): Promise<any> {
    console.log("path: ", path);
    return this.http.get(this.getURL(path), {headers: this.headers})
    .toPromise()
    .catch(ApiServiceProvider.handleError);
  }

  public post(path: string, body: any): Promise<any> {
    return this.http.post(this.getURL(path), JSON.stringify(body), {headers: this.headers})
    .toPromise()
    .catch(ApiServiceProvider.handleError);
  }

  public put(path: string, body): Promise<any> {
    return this.http.put(this.getURL(path), JSON.stringify(body), {headers: this.headers})
    .toPromise()
    .catch(ApiServiceProvider.handleError);
  }

  public delete(path): Promise<any> {
    return this.http.delete(this.getURL(path), {headers: this.headers})
    .toPromise()
    .catch(ApiServiceProvider.handleError);
  }

}

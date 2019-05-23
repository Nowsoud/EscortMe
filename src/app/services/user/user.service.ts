import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Mock } from 'protractor/built/driverProviders';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  mock: any = {
    id:"jskonw1999",
    pic:"https://upload.wikimedia.org/wikipedia/ru/c/c6/Jon_Snow_HBO.jpg",
    name:"Jon Snow",
    email:"king.on@wall.com",
    state:"Crowing",
    geo:{
      lat:0,
      lng:0
    }
  }

  constructor(private storage: Storage) { 
  }

  getUserInfo(){
    return new Promise((resolve, reject)=>{
      this.storage.get('userInfo').then(local_res=>
        {
          if(local_res!=null){
            console.log("user data comes from local store");
            resolve(local_res)
          }
          else{
            console.log("local store is empty");
            this.getDataFromRemoteStorage().then(remote_res=>{
              console.log("user data comes from remote store");
              this.updateUserInfo(remote_res);
              resolve(remote_res)
            })
          }
        })
    });
  }
  clearUserInfo(){
    this.storage.clear();
  }
  updateUserGeo(geo:Float32List){
    this.mock.geo.lat = geo[0]
    this.mock.geo.lng = geo[1]
    return this.updateUserInfo(this.mock)
  }
  private getDataFromRemoteStorage(){
    //TODO: get proper data from firestore
    return new Promise((resolve, reject)=>{
      resolve(this.mock)
    });
  }
  
  private updateUserInfo(userInfo){
    //TODO sync data on remote storage
    
    console.log("local store was updated");
    return this.storage.set('userInfo', userInfo);
  }


}

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

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
      lat:50.03,
      lng:19.95
    }
  }

  constructor(private storage: Storage) { 
    this.storage.remove('userInfo');
  }

  private getDataFromRemoteStorage(){
    //TODO: get proper data from firestore
    return new Promise((resolve, reject)=>{
      resolve(this.mock)
    });
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

  private updateUserInfo(userInfo){
    this.storage.set('userInfo', userInfo);
    console.log("local store was updated");
  }
}

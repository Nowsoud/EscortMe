import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  mock: any = {
    id:"jskonw1999",
    pic:"https://upload.wikimedia.org/wikipedia/ru/c/c6/Jon_Snow_HBO.jpg",
    name:"Jon Snow",
    email:"king.on@wall.com",
    state:"walking",
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
              var userInfo = {
                ...remote_res.data(),
                pic: firebase.auth().currentUser.photoURL,
                name: firebase.auth().currentUser.displayName,
                email: firebase.auth().currentUser.email
              }
              this.updateUserInfo(userInfo);
              resolve(userInfo)
            })
          }
        })
    });
  }
  clearUserInfo(){
    this.storage.clear();
  }
  updateUserGeo(geo:Float32List){
    this.storage.get('userInfo').then(local_res=>
      {
        local_res.geo = geo
        this.updateUserInfo(local_res).catch(err => console.log(err))
      })
    return firebase.firestore().doc('users/' + firebase.auth().currentUser.email).update({
      geo: geo
    })
  }

  updateUserState(state:string){
    this.storage.get('userInfo').then(local_res=>
      {
        local_res.state = state
        this.updateUserInfo(local_res).catch(err => console.log(err))
      })
    return firebase.firestore().doc('users/' + firebase.auth().currentUser.email).update({
      state: state
    })
  }
  private getDataFromRemoteStorage(){
    return firebase.firestore().doc('users/' + firebase.auth().currentUser.email).get()
  }

  private updateUserInfo(userInfo){
    //TODO sync data on remote storage
    
    console.log("local store was updated");
    return this.storage.set('userInfo', userInfo);
  }
}

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  mock: any = {
    id: "jskonw1999",
    pic: "https://upload.wikimedia.org/wikipedia/ru/c/c6/Jon_Snow_HBO.jpg",
    name: "Jon Snow",
    email: "king.on@wall.com",
    state: "walking",
    geo: {
      lat: 0,
      lng: 0
    }
  }
  constructor(private storage: Storage) {
  }
  getUserInfo() {
    return new Promise<any>((resolve, reject) => {
      this.storage.get('userInfo').then(local_res => {
        if (local_res != null) {
          console.log("user data comes from local store");
          resolve(local_res)
        }
        else {
          console.log("local store is empty");
          this.getDataFromRemoteStorage().then(remote_res => {
            console.log("user data comes from remote store");
            this.updateUserInfo(remote_res.data()).then(() => resolve(remote_res.data()));
          })
        }
      })
    });
  }
  clearUserInfo() {
    this.storage.clear();
  }

  getCertainUserInfo(friendId) {
    return new Promise((resolve, reject) => {
      firebase.firestore().doc('users/' + friendId).get().then(snapshot =>
        resolve(snapshot.data()),
        err => reject(err))
    })
  }

  updateCurrentUserFriends(friendId) {
    return new Promise((resolve, reject) => {
      this.getUserInfo().then(local_res => {
        local_res.friends.unshift(friendId)
        this.updateUserInfo(local_res)

      })
    })
  }

  updateUserGeo(geo: Float32List) {
    this.storage.get('userInfo').then(local_res => {
      local_res.geo = geo
      this.updateUserInfo(local_res).catch(err => console.log(err))
    })
    return firebase.firestore().doc('users/' + firebase.auth().currentUser.uid).update({
      geo: geo
    })
  }

  watchUser(uid: string): Observable<any> {
    return Observable.create((observer: any) => {
      try {
        setInterval(() => {
          this.getCertainUserInfo(uid)
            .then(userInfo=> observer.next(userInfo))
            .catch(err=>observer.error(err))
        }, 1000)
      } catch (err) {
        observer.error(err)
      }
    });

  }

  updateUserState(state: string) {
    this.storage.get('userInfo').then(local_res => {
      local_res.state = state
      this.updateUserInfo(local_res).catch(err => console.log(err))
    })
    return firebase.firestore()
      .doc('users/' + firebase.auth().currentUser.uid)
      .update({ state: state })
  }
  private getDataFromRemoteStorage() {
    return firebase.firestore().doc('users/' + firebase.auth().currentUser.uid).get()
  }

  private updateUserInfo(userInfo) {
    return this.storage.set('userInfo', userInfo);
  }


}

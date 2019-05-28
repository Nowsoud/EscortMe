import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserService } from 'src/app/services/user/user.service';
import { Observable } from 'rxjs';
import { Mock } from 'protractor/built/driverProviders';
import { ToastService } from '../toast/toast.service';
import * as firebase from 'firebase/app';
import { userInfo } from 'os';
@Injectable({
  providedIn: 'root'
})
export class FriendsService {
 
  constructor(private storage: Storage,
    private toast: ToastService,
    private userService: UserService) { }

  downloadDetailedDataAboutFriendsToStore() {
    return this.storage.get('userInfo').then(info => {
      Promise.all(info.friends.map(friendId => this.userService.getCertainUserInfo(friendId)))
        .then(data => this.storage.set('friendsInfo', data))
    }, err => console.log(err))
  }
  addFriend(friendId: string) {
    return new Promise((resolve, reject) => {
      this.userService.getUserInfo().then(userInfo => {
        if (userInfo.friends && userInfo.friends.includes(friendId)) {
          reject("friend already in friend list ")
        } else {
          firebase
            .firestore()
            .doc('users/' + firebase.auth().currentUser.uid)
            .update({ friends: firebase.firestore.FieldValue.arrayUnion(friendId) })
            .then(() => {
              this.userService.updateCurrentUserFriends(friendId)

              this.storage.get('friendsInfo')
                .then((friendsInfoCollection) => {
                  this.userService.getCertainUserInfo(friendId)
                    .then(fullFriendInfo => {
                      friendsInfoCollection.unshift(fullFriendInfo)
                      this.storage.set('friendsInfo', friendsInfoCollection)
                        .then(() => resolve())
                    })
                })
            })
        }
      })
    })
  }

  searchFriends(searchTerm: string) {
    return new Promise((resolve, reject) => {
      this.storage.get('friendsInfo').then(info => {
        resolve(info.filter(item => item.email.includes(searchTerm) || item.name.toLowerCase().includes(searchTerm)))
      }, err => reject(err))
    })
  }


  getByID(id) {
    return new Promise((resolve, reject) => {
      this.storage.get('friendsInfo')
        .then((friendsInfoCollection) => resolve(friendsInfoCollection.filter(x => x.id == id)[0]))
    });
  }
}

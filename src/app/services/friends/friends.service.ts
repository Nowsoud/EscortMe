import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserService } from 'src/app/services/user/user.service';
import { Observable } from 'rxjs';
import { Mock } from 'protractor/built/driverProviders';
import { ToastService } from '../toast/toast.service';
import * as firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  mock:any=[
    {
      id:"sem1459",
      pic:"https://upload.wikimedia.org/wikipedia/ru/thumb/0/03/John_Bradley_as_Samwell_Tarly.jpg/267px-John_Bradley_as_Samwell_Tarly.jpg",
      name:"Samwell Tarly",
      email:"dethkiller777@wall.com",
      state:"walking",
      geo:{
        lat:50.08,
        lng:19.95
      }
    },
    {
      id:"thorm999",
      pic:"https://cdn1.intermedia.ru/img/news/313900.jpg",
      name:"Tormund",
      email:"king.on@wall.com",
      state:"standing",
      geo:{
        lat:19.08,
        lng:50.08
      }
    }
  ]
  constructor(private storage: Storage,
              private toast:ToastService,
              private userService: UserService)
              {this.downloadDetailedDataAboutFriendsToStore()}

  downloadDetailedDataAboutFriendsToStore() {
      this.storage.get('userInfo').then(info=>{
        Promise.all(info.friends.map(friendId => this.userService.getCertainUserInfo(friendId)))
        .then(data =>  this.storage.set('friendsInfo', data))
      }, err => console.log(err))
  }
  addFriend(friendId: string) {
    return new Promise((resolve, reject) => {
      firebase
      .firestore()
      .doc('users/' + firebase.auth().currentUser.uid)
      .update({friends: firebase.firestore.FieldValue.arrayUnion(friendId)})
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
    })
  }

  searchFriends(searchTerm: string){
    return new Promise((resolve, reject) => {
      this.storage.get('friendsInfo').then(info => {
        resolve (info.filter(item => item.email.includes(searchTerm) || item.name.toLowerCase().includes(searchTerm)))
      }, err => reject(err))
    })
  }

  getWatchingFriends(){
    return new Promise((resolve, reject)=>{
      resolve(this.mock)
    });
  }

  getByID(id){
    return new Promise((resolve, reject)=>{
      this.storage.get('friendsInfo')
          .then((friendsInfoCollection) => resolve(friendsInfoCollection.filter(x=>x.id == id)[0]))
    });
  }
}

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs';
import { Mock } from 'protractor/built/driverProviders';
@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  searchFriends(searchTerm: string){
    if (searchTerm != "") {
      return this.mock.filter(item => item.name.toLowerCase().includes(searchTerm) || item.email.includes(searchTerm));
    } else {
      return this.mock
    }
    
  }

  // fetchDetailedDataAboutFriends() {
  //   return new Promise((resolve, reject) =>

  //     this.storage.get('userInfo').then(info=>{

  //     })
  //   )
  // }

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
  constructor(private storage: Storage) { }

  getWatchingFriends(){
    return new Promise((resolve, reject)=>{
      resolve(this.mock)
    });
  }

  getByID(id){
    return new Promise((resolve, reject)=>{
      resolve(this.mock.filter(x=>x.id == id)[0])
    });
  }
}

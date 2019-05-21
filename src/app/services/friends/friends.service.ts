import { Injectable } from '@angular/core';

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
      state:"Reading",
      geo:{
        lat:19.09,
        lon:50.09
      }
    },
    {
      id:"thorm999",
      pic:"https://cdn1.intermedia.ru/img/news/313900.jpg",
      name:"Tormund",
      email:"king.on@wall.com",
      state:"Getting drunk",
      geo:{
        lat:19.08,
        lon:50.08
      }
    }
  ]
  constructor() { }

  getWatchingFriends(){
    return new Promise((resolve, reject)=>{
      resolve(this.mock)
    });
  }
}

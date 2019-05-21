import { Injectable } from '@angular/core';

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
      lat:19.08,
      lon:50.08
    }
  }

  constructor() { }

  getUserInfo(){
    return new Promise((resolve, reject)=>{
      resolve(this.mock)
    });
  }
}

import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() {
   }

  registerUser(value){
    return firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
   }
  
   loginUser(value){
    return firebase.auth().signInWithEmailAndPassword(value.email, value.password)
   }
  
   logoutUser(){
     return firebase.auth().signOut()
   }
   
}

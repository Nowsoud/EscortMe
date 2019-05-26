import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../services/toast/toast.service';
import * as firebase from 'firebase/app';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  validations_form: FormGroup;
  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    'name': [
      {type: 'required', message: 'Name is required.'}
    ]
  };
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private toast: ToastService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      name: new FormControl('', Validators.required)
    });
  }

  tryRegister(value){
    this.authService.registerUser(value)
      .then(res => {
        Promise.all([
          res.user.updateProfile({
            displayName: value.name,
            photoURL: 'https://user-images.githubusercontent.com/6009640/31679076-dc7581c6-b391-11e7-87fe-a8fa89793c63.png'
          }),
          firebase.firestore().doc('users/' + res.user.email).set({
            'id':firebase.auth().currentUser.uid,
            'state': 'initial state',
            'geo': null
          })
        ])
        .then(() => {
          firebase.auth().currentUser.reload().then(() => 
            this.navCtrl.navigateRoot('home')          
          )
        })
      }, err => {
        this.toast.present(err.message)
      })
  }
 
  goLoginPage(){
    this.navCtrl.navigateBack('login');
  }
}

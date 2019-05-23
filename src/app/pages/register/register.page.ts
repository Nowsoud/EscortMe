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
    });
  }

  tryRegister(value){
    this.authService.registerUser(value)
     .then(res => {
        // db.doc('/users/' + res.user.uid).set({
        firebase.firestore().collection('users').doc('123').set({
          // 'id': res.user.uid,
          // 'email': res.user.email,
          // 'state': 'hardcoded state'
          "test": 'test'
        }).then(() => {

        }, err => {
          this.toast.present(err.message);
        })
        this.authService.loginUser(value)
        .then(res => {
          this.navCtrl.navigateRoot('home');
        }, err => {
          this.toast.present(err.message);
        })
     }, err => {
       this.toast.present(err.message)
     })
  }
 
  goLoginPage(){
    this.navCtrl.navigateBack('login');
  }
}

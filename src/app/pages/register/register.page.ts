import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../services/toast/toast.service';
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

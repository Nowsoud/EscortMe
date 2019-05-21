import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication/authentication.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userEmail: string;
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {

  }
  onLogout(){
    this.authService.logoutUser()
    .then(res => {
      console.log(res);
      this.navCtrl.navigateRoot('login');
    })
    .catch(error => {
      console.log(error);
    })
  }
}

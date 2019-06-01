import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userInfo: any;
  qr_link:string;
  constructor(
    private userService: UserService,
    private toast:ToastService,
    private navCtrl: NavController,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.userService.getUserInfo()
    .then(userInfo => {
      this.userInfo = userInfo
      this.qr_link = "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data="+userInfo.id
    })
  }
  onLogout(){
    this.authService.logoutUser()
    .then(res => this.navCtrl.navigateRoot('login'))
    .catch(error => this.toast.present(error))
    this.userService.clearUserInfo();
  }
}

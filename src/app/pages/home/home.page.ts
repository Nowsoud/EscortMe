import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { FriendsService } from 'src/app/services/friends/friends.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userInfo: any;
  watchingFriends: any;
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private userService: UserService,
    private friendsService: FriendsService,
    private toast:ToastService
  ) { }

  ngOnInit() {
    this.userService.getUserInfo()
      .then(res=>this.userInfo = res)
      .catch(err=>this.toast.present(err));

    this.watchingFriends = this.friendsService.getWatchingFriends();
  }
  onLogout(){
    this.authService.logoutUser()
    .then(res => this.navCtrl.navigateRoot('login'))
    .catch(error => this.toast.present(error))
  }
}

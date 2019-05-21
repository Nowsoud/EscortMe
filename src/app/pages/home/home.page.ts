import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userEmail: string;
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private toast:ToastService
  ) { }

  ngOnInit() {

  }
  onLogout(){
    this.authService.logoutUser()
    .then(res => this.navCtrl.navigateRoot('login'))
    .catch(error => this.toast.present(error))
  }
}

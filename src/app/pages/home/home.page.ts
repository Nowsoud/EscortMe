import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
import { LineToLineMappedSource } from 'webpack-sources';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userInfo: any;
  map: Map;
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
      .then(res=>
      {
        this.userInfo = res
        this.Loadmap()
        this.PointUserMarker()
      })
      .catch(err=>this.toast.present(err));

    this.watchingFriends = this.friendsService.getWatchingFriends();
    
  }
  onLogout(){
    this.authService.logoutUser()
    .then(res => this.navCtrl.navigateRoot('login'))
    .catch(error => this.toast.present(error))
  }
  Loadmap() {
    console.log([this.userInfo.geo.lat, this.userInfo.geo.lng]);
    this.map = new Map('map').setView([this.userInfo.geo.lat, this.userInfo.geo.lng], 12);
    tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', 
    {maxZoom: 18,}).addTo(this.map);
  }
  PointUserMarker(){
    marker([this.userInfo.geo.lat, this.userInfo.geo.lng])
    .addTo(this.map)
    .bindPopup(`<b>${this.userInfo.name}</b>  <p>${this.userInfo.state}</p>`)
    .openPopup();
  }
  ionViewWillLeave() {
    this.map.remove();
  }
}

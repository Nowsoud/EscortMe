import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  userInfo: any;
  map: Map;
  currentMarker: any;
  watchingFriends: any;
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private userService: UserService,
    private friendsService: FriendsService,
    private toast:ToastService,
    private geolocation: Geolocation
  ) { }

  ngOnInit() {
    this.userService.getUserInfo()
      .then(res=>
      {
        this.userInfo = res
        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
          if(data.coords){
              this.userService.updateUserGeo([data.coords.latitude, data.coords.longitude])
              .then(res=>this.PointUserMarker())
              .catch(err=>this.toast.present(err))
          }
          else console.log(data);
        });
      })
      .catch(err=>this.toast.present(err));
    this.watchingFriends = this.friendsService.getWatchingFriends();
    this.Loadmap()
  }
  onLogout(){
    this.authService.logoutUser()
    .then(res => this.navCtrl.navigateRoot('login'))
    .catch(error => this.toast.present(error))
    this.userService.clearUserInfo();
  }
  Loadmap() {
    this.userService.getUserInfo().then(user=>{
      this.userInfo = user
      this.map = new Map('map').setView([this.userInfo.geo.lat, this.userInfo.geo.lng], 12);
      tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', 
      {maxZoom: 18,}).addTo(this.map);
    })
  }
  PointUserMarker(){
    this.userService.getUserInfo().then(user=>{
      this.userInfo = user
      console.log("update geo: ",user);
      
      this.currentMarker = marker([this.userInfo.geo.lat, this.userInfo.geo.lng]);
      this.currentMarker.addTo(this.map)
      .bindPopup(`<b>${this.userInfo.name}</b>  <p>${this.userInfo.state}</p>`)
      .openPopup();
    })
  }
  ionViewWillLeave() {
    //this.map.remove();
  }
}

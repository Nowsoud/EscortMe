import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { Map, latLng, tileLayer, Layer, marker, icon } from 'leaflet';
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
    private userService: UserService,
    private friendsService: FriendsService,
    private toast:ToastService,
    private geolocation: Geolocation
  ) { }

  ngOnInit() {
    this.watchingFriends = this.friendsService.getWatchingFriends();
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
  }
  Loadmap() {
    this.userService.getUserInfo().then(user=>{
      this.userInfo = user
      this.map = new Map('map')//.setView(this.userInfo.geo, 12);
      // tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', 
      // {maxZoom: 18,}).addTo(this.map);
    })
  }
  PointUserMarker(){
    this.userService.getUserInfo().then(user=>{
      this.userInfo = user
      console.log("update geo: ",user);
      if (this.userInfo.geo != null) {
        var m_icon = icon({
          iconUrl: "https://firebasestorage.googleapis.com/v0/b/escortme-2c3d1.appspot.com/o/ninja-portable.png?alt=media&token=6539eaca-592d-498a-a4ca-a2d8596d2db3",
          iconSize:     [40, 40],
          popupAnchor:  [3, -20]
        });
        this.currentMarker = marker(this.userInfo.geo,{icon: m_icon});
        this.currentMarker.addTo(this.map)
        .bindPopup(`<b>${this.userInfo.name}</b>  <p>${this.userInfo.state}</p>`)
        .openPopup();
      }
    })
  }
  ionViewWillLeave() {
    this.map.remove();
  }
  
  ionViewWillEnter(){
    this.Loadmap()
    this.PointUserMarker()
  }
}

import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { Map, latLng, tileLayer, Layer, marker, icon } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  userInfo: any;
  map: Map;
  currentMarker: any;
  stateTest: string = "initial state";
  motionCache: Array<number[]> = new Array<number[]>();
  watchingFriends: any;
  constructor(
    private userService: UserService,
    private friendsService: FriendsService,
    private toast:ToastService,
    private geolocation: Geolocation,
    private deviceMotion: DeviceMotion,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.watchingFriends = this.friendsService.getWatchingFriends();
    this.userService.getUserInfo()
      .then(res=>
      {
        this.friendsService.downloadDetailedDataAboutFriendsToStore()
        this.geolocation.watchPosition().subscribe((data) => {
          if(data.coords){
              this.userService.updateUserGeo([data.coords.latitude, data.coords.longitude])
              .then(res=>this.PointUserMarker())
              .catch(err=>this.toast.present(err))
          }
          else console.log(data);
        });

        this.deviceMotion.watchAcceleration({ frequency: 250 }).subscribe((data) => {
          this.stateTest = data.x + " " + data.y + " " + data.z;
          this.motionCache.push([data.x,data.y,data.z]);

          if(this.motionCache.length >= 8){
            
            //todo: compute state
            var state = "standing"

            this.userService.updateUserState(state);
            delete(this.motionCache)
            this.motionCache = new Array<number[]>();
          }

        });



      })
      .catch(err=>this.toast.present(err));
  }
  Loadmap() {
    this.userService.getUserInfo().then(user=>{
      this.userInfo = user
      this.map = new Map('map').setView([50, 26], 2);
      tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', 
      {maxZoom: 18,}).addTo(this.map);
    })
  }
  PointUserMarker(){
    this.userService.getUserInfo().then(user=>{
      this.userInfo = user
      if (this.userInfo.geo != null) {
        console.log("update geo: ",user);
        this.map.setView(this.userInfo.geo, 12)
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

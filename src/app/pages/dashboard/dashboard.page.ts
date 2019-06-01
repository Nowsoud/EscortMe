import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { videoOverlay, Map, latLng, tileLayer, Layer, marker, icon } from 'leaflet';
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
    private toast: ToastService,
    private geolocation: Geolocation,
    private deviceMotion: DeviceMotion,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.userService.getUserInfo()
      .then(res => {
        this.geolocation.watchPosition().subscribe((data) => {
          if (data.coords) {
            this.userService.updateUserGeo([data.coords.latitude, data.coords.longitude])
              .then(res => this.PointUserMarker())
              .catch(err => this.toast.present(err))
          }
          else console.log(data);
        });

        this.deviceMotion.watchAcceleration({ frequency: 250 }).subscribe((data) => {
          this.stateTest = data.x + " " + data.y + " " + data.z;
          this.motionCache.push([data.x, data.y, data.z]);

          if (this.motionCache.length >= 8) {

            //todo: compute state
            var state = "standing"

            this.userService.updateUserState(state);
            delete (this.motionCache)
            this.motionCache = new Array<number[]>();
          }

        });
      })
      .catch(err => this.toast.present(err));
  }

  Loadmap() {
    return new Promise((resolve, reject) => {
      this.userService.getUserInfo().then(user => {
        this.userInfo = user
        this.map = new Map('map').setView(this.userInfo.geo, 12);
        tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          { maxZoom: 18, }).addTo(this.map);

        resolve()
      })
    })
  }
  PointUserMarker() {
    
    var m_icon = icon({
      iconUrl: "https://firebasestorage.googleapis.com/v0/b/escortme-2c3d1.appspot.com/o/map_icon.png?alt=media&token=bbd4daaa-006e-4b2c-a01a-2fb631f0bced",
      iconSize: [35, 35],
      popupAnchor: [3, -20]
    });

    if (this.userInfo) {
      if (!this.currentMarker) 
        this.currentMarker = marker(this.userInfo.geo, { icon: m_icon })
          .bindPopup(`<b>${this.userInfo.name}</b><p>${this.userInfo.state}</p>`);
       else 
        this.currentMarker.setLatLng(this.userInfo.geo)
        this.currentMarker.addTo(this.map)
    }
  }
  ionViewWillLeave() {
    this.map.remove();
  }

  ionViewWillEnter() {
    this.Loadmap().then(() => this.PointUserMarker())
  }
}

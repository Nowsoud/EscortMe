import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { Map, tileLayer, marker, icon } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { StateMapperService } from 'src/app/services/stateMapper/state-mapper.service';
import { RandomForest } from 'src/app/models/random-forest';

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
    private toast: ToastService,
    private geolocation: Geolocation,
    private stateProvider: StateMapperService
  ) { }

  ngOnInit() {
    this.userService.getUserInfo()
      .then(user => this.userInfo = user).catch(err => this.toast.present(err.message));

    this.geolocation.watchPosition().subscribe((data) => {
      if (data.coords) {
        let geo = [data.coords.latitude, data.coords.longitude];
        this.userService.updateUserGeo(geo);
        this.PointUserMarker(geo)
      }
      else {
        this.toast.present("Geo data not found")
      }
    });

    this.stateProvider.watchState().subscribe(data => {
      let stateId = new RandomForest().predict(data);
      let mapper = {
        0: 'standing',
        1: 'walking',
        2: 'activity',
        3: 'on table'
      };
      var state = mapper[stateId];
      this.userInfo.state = state;
      this.userService.updateUserState(state)
    })
  }

  Loadmap(geo) {
    this.map = new Map('map').setView(geo, 12);
    tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      { maxZoom: 18, }).addTo(this.map);
  }

  PointUserMarker(geo) {
    var m_icon = icon({
      iconUrl: "https://firebasestorage.googleapis.com/v0/b/escortme-2c3d1.appspot.com/o/map_icon.png?alt=media&token=bbd4daaa-006e-4b2c-a01a-2fb631f0bced",
      iconSize: [35, 35],
      popupAnchor: [3, -20]
    });

    if (!this.currentMarker)
      this.currentMarker = marker(geo, { icon: m_icon });
    else
      this.currentMarker.setLatLng(geo)

    this.currentMarker.addTo(this.map)
  }

  OnDangerButtonClick() {
    this.userInfo.security_status = 'danger'
    this.userService.updateUserSecurityStatus('danger');
  }
  OnSafeButtonClick() {
    this.userInfo.security_status = 'safe'
    this.userService.updateUserSecurityStatus('safe');
  }

  ionViewWillEnter() {
    this.updateMap()
  }

  updateMap() {
    if (this.map)
      this.map.remove()
    this.userService.getUserInfo()
      .then(user => {
        if (user && user.geo) {
          this.Loadmap(user.geo)
          this.PointUserMarker(user.geo)
        }
        else
          this.Loadmap([54, 19])
      }).catch((err) => this.toast.present(err.message))
  }
}

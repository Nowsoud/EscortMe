import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import {  Map, tileLayer, marker, icon } from 'leaflet';
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
      .then(res => {
        this.geolocation.watchPosition().subscribe((data) => {
          if (data.coords) {
            this.userService.updateUserGeo([data.coords.latitude, data.coords.longitude])
              .then(res => this.PointUserMarker())
              .catch(err => this.toast.present(err))
          }
          else console.log(data);
        });
      })
      .catch(err => this.toast.present(err));

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

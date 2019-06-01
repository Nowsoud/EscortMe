import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { Map, latLng, tileLayer, Layer, marker, icon } from 'leaflet';
import { ToastService } from 'src/app/services/toast/toast.service';
import { userInfo } from 'os';
import { UserService } from 'src/app/services/user/user.service';
@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.page.html',
  styleUrls: ['./friend-details.page.scss'],
})
export class FriendDetailsPage implements OnInit {
  userInfo: any;
  currentMarker: any;
  map: Map;
  id: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private friendsService: FriendsService,
    private userService: UserService,
    private toast: ToastService) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
    this.friendsService.getByID(this.id)
      .then(user => {this.userInfo = user})
      .catch(err => this.toast.present(err.message));

    this.userService.watchUser(this.id)
      .subscribe(user => {
        this.userInfo = user
        this.PointUserMarker()
      })
  }
  Loadmap() {
    return new Promise((resolve, reject)=>{
      this.friendsService.getByID(this.id).then(user => {
        this.userInfo = user
        this.map = new Map('fmap').setView(this.userInfo.geo, 12);
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
    if (this.map)
      this.map.remove();
    this.Loadmap().then(()=>this.PointUserMarker())
  }
}

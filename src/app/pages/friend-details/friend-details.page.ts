import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { Map, latLng, tileLayer, Layer, marker, icon } from 'leaflet';
import { ToastService } from 'src/app/services/toast/toast.service';
@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.page.html',
  styleUrls: ['./friend-details.page.scss'],
})
export class FriendDetailsPage implements OnInit {
  userInfo:any;
  currentMarker: any;
  map: Map;
  id:string;
  constructor(
    private activatedRoute:ActivatedRoute,
    private friendsService:FriendsService,
    private toast:ToastService) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
    this.friendsService.getByID(this.id)
      .then(user=>this.userInfo = user)
      .catch(err=>this.toast.present(err));
  }
  Loadmap() {
    this.friendsService.getByID(this.id).then(user=>{
      
      this.userInfo = user
      this.map = new Map('fmap').setView(this.userInfo.geo, 12);
      tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {maxZoom: 18,}).addTo(this.map);
    })
  }
  PointUserMarker(){
    this.friendsService.getByID(this.id).then(user=>{
      this.userInfo = user
      var m_icon = icon({
        iconUrl: "https://firebasestorage.googleapis.com/v0/b/escortme-2c3d1.appspot.com/o/ninja-portable.png?alt=media&token=6539eaca-592d-498a-a4ca-a2d8596d2db3",
        iconSize:     [40, 40],
        popupAnchor:  [3, -20]
      });
      this.currentMarker = marker(this.userInfo.geo,{icon: m_icon});
      this.currentMarker.addTo(this.map)
      .bindPopup(`<b>${this.userInfo.name}</b>  <p>${this.userInfo.state}</p>`)
      .openPopup();
    })
  }
  ionViewWillLeave() {
    this.map.remove();
  }
  
  ionViewWillEnter(){
    if(this.map) 
      this.map.remove();
    this.Loadmap()
    this.PointUserMarker()
  }
}

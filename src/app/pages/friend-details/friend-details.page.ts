import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
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
      this.map = new Map('fmap').setView([this.userInfo.geo.lat, this.userInfo.geo.lng], 12);
      tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {maxZoom: 18,}).addTo(this.map);
    })
  }
  PointUserMarker(){
    this.friendsService.getByID(this.id).then(user=>{
      this.userInfo = user
      console.log("update geo: ",user);
      
      this.currentMarker = marker([this.userInfo.geo.lat, this.userInfo.geo.lng]);
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

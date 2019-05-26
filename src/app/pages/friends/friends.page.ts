import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  friendList:any;
  result:any;
  friendId: string;

  searchTerm = ""
  constructor(
    private friendsService: FriendsService,
    private barcodeScanner: BarcodeScanner) { }

  ngOnInit() {
    this.result = this.friendsService.searchFriends(this.searchTerm)
  }

  searchChanged(){
    
    this.result = this.friendsService.searchFriends(this.searchTerm)
  }

  addFriend(){
    this.barcodeScanner.scan().then(barcodeData => {
      this.friendsService.addFriend(barcodeData.text)
     }).catch(err => {
         console.log('Error', err);
     });
    
  }
}

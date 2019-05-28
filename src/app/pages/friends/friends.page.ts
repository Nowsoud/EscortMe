import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  friendList: any;
  result: any;
  friendId: string;

  searchTerm = ""
  constructor(
    private friendsService: FriendsService,
    private barcodeScanner: BarcodeScanner,
    public platform: Platform) { }

  ngOnInit() {
    this.searchChanged()
  }

  searchChanged() {
    this.friendsService.searchFriends(this.searchTerm)
    .then((result) => {
      this.result = result
    })
  }

  addFriend() {
    if (this.platform.is('cordova') || this.platform.is('mobile')) {
      this.barcodeScanner.scan().then(barcodeData => {
        this.friendsService.addFriend(barcodeData.text)
          .then(() => this.searchChanged())
      }).catch(err => {
        console.log('Error', err);
      });
    } else {
      this.friendsService.addFriend(this.friendId).then(() => this.searchChanged())
    }
  }
}

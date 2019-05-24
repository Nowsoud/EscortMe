import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FriendsService } from 'src/app/services/friends/friends.service';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  friendList:any;
  result:any;

  searchTerm = ""
  constructor(private friendsService: FriendsService) { }

  ngOnInit() {
    this.result = this.friendsService.searchFriends(this.searchTerm)
  }

  searchChanged(){
    
    this.result = this.friendsService.searchFriends(this.searchTerm)
  }
}

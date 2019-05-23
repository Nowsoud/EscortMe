import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { userInfo } from 'os';
@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.page.html',
  styleUrls: ['./friend-details.page.scss'],
})
export class FriendDetailsPage implements OnInit {

  userInfo:any;

  constructor(
    private activatedRoute:ActivatedRoute,
    private friendsService:FriendsService) { }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id')
    this.userInfo = this.friendsService.getByID(id);
  }

}

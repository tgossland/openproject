//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++
import {Component, Inject, Input, OnInit} from "@angular/core";
import {I18nToken} from "core-app/angular4-transition-utils";
import {WorkPackageResource} from "core-app/modules/hal/resources/work-package-resource";
import {UserCacheService} from "core-components/user/user-cache.service";
import {UserResource} from "core-app/modules/hal/resources/user-resource";
import {ProjectResource} from "core-app/modules/hal/resources/project-resource";
import {TimezoneService} from "core-components/datetime/timezone.service";

@Component({
  selector: 'revision-activity',
  templateUrl: './revision-activity.component.html'
})
export class RevisionActivityComponent implements OnInit {
  @Input() public workPackage:WorkPackageResource;
  @Input() public activity:any;
  @Input() public activityNo:number;
  @Input() public activityLabel:string;

  public userId:string | number;
  public userName:string;
  public userAvatar:string;
  public userActive:boolean;
  public userPath:string | null;
  public userLabel:string;

  public project:ProjectResource;
  public revision:string;
  public formattedRevision:string;
  public message:string;

  public revisionLink:string;

  constructor(@Inject(I18nToken) readonly I18n:op.I18n,
              readonly timezoneService:TimezoneService,
              readonly userCacheService:UserCacheService) {
  }

  ngOnInit() {
    this.loadAuthor();

    this.project = this.workPackage.project;
    this.revision = this.activity.identifier;
    this.message = this.activity.message.html;

    const revisionPath = this.activity.showRevision.$link.href;
    const formattedRevision = this.activity.formattedIdentifier;

    const link = document.createElement('a');
    link.href = revisionPath;
    link.title = this.revision;
    link.textContent = this.I18n.t(
      "js.label_committed_link",
      {revision_identifier: formattedRevision}
    );

    this.revisionLink = this.I18n.t("js.label_committed_at",
      {
        committed_revision_link: link,
        date: this.timezoneService.formattedDatetime(this.activity.createdAt)
      });
  }

  private loadAuthor() {
    if (this.activity.author === undefined) {
      this.userName = this.activity.authorName;
    } else {
      this.userCacheService
        .require(this.activity.user.idFromLink  )
        .then((user:UserResource) => {
          this.userId = user.id;
          this.userName = user.name;
          this.userAvatar = user.avatar;
          this.userActive = user.isActive;
          this.userPath = user.showUser.href;
          this.userLabel = this.I18n.t('js.label_author', {user: this.userName});
        });
    }
  }
}

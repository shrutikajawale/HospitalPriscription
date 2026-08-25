import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuConstant } from '../../core/constant/Menu.Constant';
import { UserService } from '../../core/services/user-service';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly userService = inject(UserService);

  readonly visibleMenuItems = computed(() => {
    const role = this.userService.loggedUserData?.roleName;
    return MenuConstant.menuItems.filter((item) => item.roles.includes(role));
  });

  itemsForSection(section: string) {
    return this.visibleMenuItems().filter((item) => item.section === section);
  }
}

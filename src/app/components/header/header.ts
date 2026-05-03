import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit, OnDestroy {

  currentUser: any = null;
  isMenuOpen = false;
  animating = false;
  private userSub: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.classList.toggle('menu-lock', this.isMenuOpen);
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.classList.remove('menu-lock');
  }

  onToggleTheme(): void {
    this.themeService.toggle();
    this.animating = true;
    setTimeout(() => (this.animating = false), 380);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.closeMenu();
      this.router.navigate(['/home']);
    });
  }

  get userName(): string {
    if (!this.currentUser) return '';
    return this.currentUser.displayName || this.currentUser.email.split('@')[0];
  }
}

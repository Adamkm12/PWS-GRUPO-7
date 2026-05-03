import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme';
import { Toast } from './components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html'
})
export class App implements OnInit {

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.applyStoredTheme();
  }
}

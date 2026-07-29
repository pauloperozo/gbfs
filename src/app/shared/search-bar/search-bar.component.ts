import { Component, input, output } from '@angular/core';
import { UI_CONFIG } from '../../core/config/ui.config';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  readonly query = input('');
  readonly queryChange = output<string>();
  
  protected readonly dictionary = UI_CONFIG.dictionary;
}
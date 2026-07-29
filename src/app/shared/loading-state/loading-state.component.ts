import { Component, input } from '@angular/core';
import { UI_CONFIG } from '../../core/config/ui.config';

@Component({
  selector: 'app-loading-state',
  templateUrl: './loading-state.component.html',
  styleUrl: './loading-state.component.css',
})
export class LoadingStateComponent {
  readonly active = input(false);
  readonly label = input<string>(UI_CONFIG.dictionary.labels.loading);
}
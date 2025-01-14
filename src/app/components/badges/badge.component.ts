
import { Component, input } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';

@Component({
  selector: 'badge-preview',
  standalone: true,
  imports: [HlmBadgeDirective],
  template: `
    <a target="_blank" href="https://github.com/goetzrobin/spartan" variant="secondary"  hlmBadge>{{ name() }}</a>
  `,
})
export class BadgePreviewComponent {
    name = input<string>();
    addStyle = input<boolean>(false);
}

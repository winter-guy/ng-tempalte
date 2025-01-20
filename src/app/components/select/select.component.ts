
import { CommonModule } from '@angular/common';
import { Component, inject, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
  selector: 'select-multi',
  standalone: true,
  imports: [BrnSelectImports, HlmSelectImports, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './select.component.html'
})
export class SelectPreviewComponent implements OnInit {
  _oil_companies = input<{label: string; value: string}[]>([]);
  changeEvent = output<string[]>();

  filterOptionsFg!: FormGroup;

  readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.filterOptionsFg = this.fb.group({
      select: [],
    });
  }

  emitControlWoValues(event: boolean) {
    event;

    let selected = (this.filterOptionsFg.get('select')?.value);
    this.changeEvent.emit(selected);
  }
}

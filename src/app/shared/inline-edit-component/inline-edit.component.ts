import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InlineEditComponent),
  multi: true
};

@Component({
  selector: 'app-inline-edit',
  templateUrl: './inline-edit.component.html',
  providers: [VALUE_ACCESSOR],
  styleUrls: ['./inline-edit.component.scss']
})
export class InlineEditComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() label: string = 'Enter value here';
  @Input() required: boolean = true;
  private _value: string = '';
  private preValue: string = '';
  public editing: boolean = false;
  public onChange: any = Function.prototype;
  public onTouched: any = Function.prototype;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  writeValue(value: any) {
    this._value = value;
  }

  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  onBlur($event: Event) {
    this.editing = false;
    if (this._value == '') {
      this._value = 'No value available';
    }
  }

  beginEdit(value: any) {
    this.preValue = value;
    this.editing = true;
  }
}

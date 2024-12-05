import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Device } from '../models/device.interface';

@Component({
  selector: 'app-modal-device-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  styles: [''],
  template: `
    <div class="modal-box w-[30vw]">
      <div class="flex flex-row items-center justify-between pb-5">
        <h3 class="text-2xl text-bold">
          {{ data === null ? 'Add device' : 'Edit device' }}
        </h3>
        <button class="btn btn-square btn-ghost" (click)="dialogRef.close()">
          <span class="material-symbols-outlined"> close </span>
        </button>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="flex flex-col justify-between gap-2">
          <label class="flex justify-between px-12">
            <span>*Name: </span>
            <input
              type="text"
              class="border rounded-md px-2 w-44"
              formControlName="name"
              required
            />
          </label>

          <label class="flex justify-between px-12">
            *Type:
            <select
              formControlName="type"
              class="select select-bordered select-sm w-44"
            >
              <option value="LIGHT">LIGHT</option>
              <option value="THERMOSTAT">THERMOSTAT</option>
              <option value="CAMERA">CAMERA</option>
              <option value="BLINDS">BLINDS</option>
            </select>
          </label>

          @switch(form.controls['type'].value) { @case ('LIGHT') {
          <label class="flex items-center justify-between px-12">
            *State:
            <input
              formControlName="state"
              type="checkbox"
              class="toggle ml-1 toggle-sm"
            />
          </label>
          <label class="flex justify-between px-12">
            *Brightness:
            <div class="flex items-center justify-between w-44">
              <input
                formControlName="brightness"
                type="range"
                min="0"
                max="100"
                class="range w-fit ml-1 pr-1 range-xs"
                step="1"
              />
              <span>{{ form.controls['brightness'].value }}%</span>
            </div>
          </label>
          } @case ('THERMOSTAT') {
          <label class="flex justify-between px-12">
            *Temperature:
            <div class="flex items-center justify-between w-44">
              <input
                formControlName="temperature"
                type="range"
                min="14"
                max="34"
                class="range w-fit ml-1 pr-1 range-xs"
                step="1"
              />
              <span>{{ form.controls['temperature'].value }}°C</span>
            </div>
          </label>
          <label class="flex justify-between px-12">
            *Mode:
            <select
              formControlName="mode"
              class="select select-bordered select-sm w-fit max-w-xs"
            >
              <option value="HEATING">Heating</option>
              <option value="COOLING">Cooling</option>
              <option value="OFF">Off</option>
            </select>
          </label>
          } @case ('CAMERA') {
          <label class="flex items-center justify-between px-12">
            *State:
            <input
              formControlName="state"
              type="checkbox"
              class="toggle ml-1 toggle-sm"
            />
          </label>
          <label class="flex items-center justify-between px-12">
            *Recording:
            <input
              formControlName="recording"
              type="checkbox"
              class="toggle ml-1 toggle-sm"
            />
          </label>
          } @case ('BLINDS') {
          <label class="flex items-center justify-between px-12">
            *State:
            <input
              formControlName="state"
              type="checkbox"
              class="toggle ml-1 toggle-sm"
            />
          </label>
          <label class="flex justify-between px-12">
            *Position:
            <div class="flex items-center justify-between w-44">
              <input
                formControlName="position"
                type="range"
                min="0"
                max="100"
                class="range ml-1 w-fit pr-1 range-xs"
                step="1"
              />
              <span>{{ form.controls['position'].value }}%</span>
            </div>
          </label>
          } }

          <div class="flex justify-end gap-2 mt-4">
            <button
              type="submit"
              class="btn shadow-md"
              [disabled]="form.invalid"
            >
              <span class="material-symbols-outlined"> save </span>
              Save
            </button>
            <button type="button" class="btn" (click)="dialogRef.close()">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class ModalDeviceFormComponent {
  dialogRef = inject<DialogRef<Device>>(DialogRef<Device>);
  data: Device | null = inject(DIALOG_DATA);
  fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    id: [this.data?.id],
    name: [this.data?.name, Validators.required],
    type: [this.data?.type, Validators.required],
  });

  constructor() {
    if (this.data !== null) {
      this.form.get('type')?.disable();
      this.addDynamicControls(this.data.type!);
    } else {
      this.form.get('type')?.valueChanges.subscribe((type: string) => {
        this.addDynamicControls(type);
      });
    }
  }

  addDynamicControls(type: string) {
    const controlsToRemove = [
      'state',
      'brightness',
      'temperature',
      'mode',
      'recording',
      'position',
    ];
    controlsToRemove.forEach((control) => {
      if (this.form.contains(control)) {
        this.form.removeControl(control);
      }
    });

    switch (type) {
      case 'LIGHT':
        this.form.addControl(
          'state',
          this.fb.control(this.data?.['state'] || false, Validators.required)
        );
        this.form.addControl(
          'brightness',
          this.fb.control(this.data?.['brightness'] || 0, Validators.required)
        );
        break;
      case 'THERMOSTAT':
        this.form.addControl(
          'temperature',
          this.fb.control(this.data?.['temperature'] || 14, Validators.required)
        );
        this.form.addControl(
          'mode',
          this.fb.control(this.data?.['mode'] || 'OFF', Validators.required)
        );
        break;
      case 'CAMERA':
        this.form.addControl(
          'state',
          this.fb.control(this.data?.['state'] || false, Validators.required)
        );
        this.form.addControl(
          'recording',
          this.fb.control(
            this.data?.['recording'] || false,
            Validators.required
          )
        );
        break;
      case 'BLINDS':
        this.form.addControl(
          'state',
          this.fb.control(this.data?.['state'] || false, Validators.required)
        );
        this.form.addControl(
          'position',
          this.fb.control(this.data?.['position'] || 0, Validators.required)
        );
        break;
    }
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    this.dialogRef.close(this.form.value);
  }
}

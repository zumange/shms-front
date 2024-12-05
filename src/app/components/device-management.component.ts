import { Component, inject, OnInit } from '@angular/core';
import { DeviceService } from '../services/device-service.service';
import { Device } from '../models/device.interface';
import { NgClass } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { ModalDeviceFormComponent } from './modal-device-form.component';
import { SnackbarService } from '../services/snackbar-service.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-device-management',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  styles: [''],
  template: `
    <div class="flex justify-end mb-2 gap-2">
      <label class="input input-bordered flex items-center gap-2">
        <input
          type="text"
          class="grow"
          placeholder="Search"
          [formControl]="searchControl"
        />
        <span class="material-symbols-outlined"> search </span>
      </label>
      <button class="btn shadow-md" (click)="onUpdate(null)">
        <span class="material-symbols-outlined text-green-400"> add </span>
        <span>Add device</span>
      </button>
    </div>
    <div
      class="border rounded-xl p-4 w-[75vw] h-[75vh] overflow-y-auto flex flex-col justify-start"
    >
      @for(device of filteredDevices; track $index) {
      <div class="flex justify-between items-center">
        <div
          class="w-full m-2 px-4 py-2 flex justify-between border rounded-xl"
          [ngClass]="{ 
          'hover:bg-light border-light' : device.type === 'LIGHT',
          'hover:bg-thermostat border-thermostat' : device.type === 'THERMOSTAT',
          'hover:bg-camera border-camera' : device.type === 'CAMERA',
          'hover:bg-blinds border-blinds' : device.type === 'BLINDS',
        }"
        >
          @for(key of objectKeys(device); track $index) { @if(key !== 'id') {
          <span class="w-1/4 text-left">{{ key }}: {{ device[key] }}</span>
          } }
        </div>
        <div class="flex gap-2 pr-2">
          <button
            class="btn btn-sm btn-square border-orange-300"
            (click)="onUpdate(device)"
          >
            <span class="material-symbols-outlined text-orange-300">
              edit
            </span>
          </button>
          <button
            class="btn btn-sm btn-square border-red-500"
            (click)="deleteDevice(device.id!)"
          >
            <span class="material-symbols-outlined text-red-500"> delete </span>
          </button>
        </div>
      </div>
      }
    </div>
  `,
})
export class DeviceManagementComponent implements OnInit {
  devices: Device[] = [];
  filteredDevices: Device[] = [];
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();
  deviceService = inject(DeviceService);
  objectKeys = Object.keys;
  dialog = inject(Dialog);
  snackbarService = inject(SnackbarService);

  ngOnInit(): void {
    this.deviceService.getAllDevices().subscribe((data: Device[]) => {
      this.devices = data.sort((d1, d2) => {
        return d1.name! > d2.name! ? 1 : -1;
      });
      this.filteredDevices = data;
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.filteredDevices = this.devices.filter((device) =>
          device.name?.toLowerCase().includes(query!.toLowerCase())
        );
      });
  }

  onUpdate(device: Device | null) {
    this.dialog
      .open(ModalDeviceFormComponent, { data: device })
      .closed.subscribe((formData) => {
        if (!formData) return;

        this.deviceService
          .updateDevice(formData)
          .subscribe((updatedDevice: Device) => {
            const index = this.devices.findIndex(
              (d) => d.id === updatedDevice.id
            );

            if (index !== -1) {
              this.devices[index] = updatedDevice;
            } else {
              this.devices.push(updatedDevice);
            }

            this.snackbarService.show({
              message: 'Device saved successfully.',
              duration: 4000,
            });
          });
      });
  }

  updateDevice(device: Device) {
    this.deviceService
      .updateDevice(device)
      .subscribe((updatedDevice: Device) => {
        const index = this.devices.findIndex((d) => d.id === updatedDevice.id);

        if (index !== -1) {
          this.devices[index] = updatedDevice;
        } else {
          this.devices.push(updatedDevice);
        }

        this.filteredDevices = this.devices;

        this.snackbarService.show({
          message: 'Device saved successfully.',
          duration: 4000,
        });
      });
  }

  deleteDevice(id: number): void {
    this.deviceService.deleteDevice(id).subscribe(() => {
      this.devices = this.devices.filter((device) => device.id !== id);
      this.snackbarService.show({
        message: 'Device deleted successfully.',
        duration: 4000,
      });

      this.filteredDevices = this.devices;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

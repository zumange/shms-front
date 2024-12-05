import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device } from '../models/device.interface';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private apiUrl = 'http://localhost:8080/api/device';

  constructor(private http: HttpClient) {}

  getAllDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl);
  }

  updateDevice(device: Device): Observable<Device> {
    if (!device.id) {
      return this.http.post<Device>(this.apiUrl, device, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      });
    }

    return this.http.put<Device>(this.apiUrl, device, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  deleteDevice(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}

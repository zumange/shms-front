export interface Device {
  id?: number;
  name?: string;
  type?: 'LIGHT' | 'THERMOSTAT' | 'CAMERA' | 'BLINDS';
  [key: string]: any;
}

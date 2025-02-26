import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new BehaviorSubject<any[]>([]);
  data$ = this.dataSubject.asObservable();

  constructor() {}

  // Method to update the data
  setData(data: any[]) {
    console.log('Data sent to DataService:', data); // Debugging
    this.dataSubject.next(data);
  }
}
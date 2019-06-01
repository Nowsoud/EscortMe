import { Injectable } from '@angular/core';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateMapperService {
  windowSize = 30;
  constructor(private accelerationService: DeviceMotion) {}
  
  private dataProcessing(arr) {
		let xarr = [];
		let yarr = [];
		let zarr = [];
		let garr = [];

		for (let i = 0; i < arr.length; i++) {
			xarr.push(arr[i][0]);
			yarr.push(arr[i][1]);
			zarr.push(arr[i][2]);
			garr.push(Math.sqrt(arr[i].map((x) => x * x).reduce((tot, cur) => tot + cur)));
		}
		let transformAxis = function(axis, g) {
			let newAxis = [];
			for (let i = 0; i < axis.length; i++) {
				newAxis.push(axis[i] / g[i]);
			}
			return newAxis;
		};
		xarr = transformAxis(xarr, garr);
		yarr = transformAxis(yarr, garr);
		zarr = transformAxis(zarr, garr);
		let getMean = function(data) {
			return (
				data.reduce(function(a, b) {
					return Number(a) + Number(b);
				}) / data.length
			);
		};
		let getSD = function(data) {
			let m = getMean(data);
			return Math.sqrt(
				data.reduce(function(sq, n) {
					return sq + Math.pow(n - m, 2);
				}, 0) /
					(data.length - 1)
			);
		};
		let getRMS = function(arr) {
			let Squares = arr.map((val) => val * val);
			let Sum = Squares.reduce((acum, val) => acum + val);
			let Mean = Sum / arr.length;
			return Math.sqrt(Mean);
		};
		return [
			getRMS(xarr),
			getRMS(yarr),
			getRMS(zarr),
			getMean(xarr),
			getMean(yarr),
			getMean(zarr),
			getSD(xarr),
			getSD(yarr),
			getSD(zarr)
		];
  }
  
  watchState(): Observable<any> {
		return Observable.create((observer: any) => {
			try {
				let records = [];
				this.accelerationService.watchAcceleration({frequency:20}).subscribe((data) => {
					records.push([ data.x, data.y, data.z ]);
					if (records.length >= this.windowSize) {
						observer.next(this.dataProcessing(records));
						records = [];
					}
				});
			} catch (err) {
				observer.error(err);
			}
		});
	}
}

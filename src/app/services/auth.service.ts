import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject, from, of, Subject } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import {User} from '../entity/user';

// create an instance of the JWT decoder utility and use it directly:
const helper = new JwtHelperService();
const TOKEN_KEY = 'auth-token';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	public authorizedObs: Observable<boolean>;
	private userData = new BehaviorSubject(null);

	constructor(
		private storage: Storage,
		private http: HttpClient,
		private platform: Platform,
		private router: Router
	) {
		this.loadStoredToken();
	}

	loadStoredToken() {
		this.platform
			.ready()
			.then(() => {
				this.storage.get(TOKEN_KEY).then((token) => {
						if (typeof token === 'string') {
							console.log('token from storage: ', token);
							const decoded = helper.decodeToken(token);
							console.log('decoded: ', decoded);
							this.userData.next(decoded);
							this.authorizedObs = of(true);
						}
					})
			.catch(() => {
				this.authorizedObs = of(false);
			});
		});
	}

	login(credentials: { email: string; password: string }): Observable<[boolean, string]> {
		if (credentials.email !== 'letme@in.com' ||
			credentials.password !== 'password') {
			return of([false, 'It is not valid credentials.']);
		}
		const subject = new Subject<[boolean, string]>();
		this.http.get('https://randomuser.me/api/').subscribe(response =>{
				const y = response;
				const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdvbWJhdGVAeWFob28uY29tIiwiZmlyc3RfbmFtZSI6IkJlbiIsImxhc3RfbmFtZSI6IlN0aWxsZXIifQ._HVnO5zwR5mep1JQ3sgiVAn_VnZKCsbTlwtIhDi75cA`;
				const decoded = helper.decodeToken(token);
				console.log('decoded: ', decoded);
				this.userData.next(decoded);
				// const tokenObs = from(this.storage.set(TOKEN_KEY, token))
				subject.next([true, token]);
			},
			error => {
				subject.next([false, error.message]);
			});
		return subject.asObservable();
	}

	getUser() {
		return this.userData.getValue();
	}

	logout() {
		this.storage.remove(TOKEN_KEY).then(() => {
			this.router.navigateByUrl('/');
			this.userData.next(null);
		});
	}
}

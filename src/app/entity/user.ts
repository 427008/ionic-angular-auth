export class User {
	constructor(public id: number, public firstName: string, public middleName: string, public lastName: string) {}
}

export class UserLogin {
	constructor(public id: number, public email: string, public phone: string,
				public firstName: string, public middleName: string, public lastName: string) {}
}

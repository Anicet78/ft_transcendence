//plus de details sur https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

export interface LoginSchema {
	email: string,
	password: string,
}

export interface User {
	id: string
	email: string
}

export interface LoginResponseSchema {
	token: string
	user: User
	roomId: string
}

export interface RegisterSchema {
	firstname: string,
	lastname: string,
	username: string,
	email: string,
	region: string,
	password: string,
}

export interface RegisterResponseSchema {
	token: string
	user: User
	roomId: string
}

export class Server {
	// static -> variable stockee avec la classe, type Server ou null tant que c'est pas initialise
	private static instance: Server | null = null;
	private api_url = "http://localhost:3001";

	public static getInstance(): Server {
		if (!Server.instance){
			Server.instance = new Server();
		}
		return (Server.instance);
	};

	public async login(email: string, password: string): Promise<LoginResponseSchema> {
		const data: LoginSchema = { "email": email, "password": password };

		//cree l'url a partir des arguments qu'on lui donne, l'appelle pour acceder au server backend et il renvoie la reponse du server backend
		const response = await fetch(
			`${this.api_url}/auth/login`,
			{
				method: 'POST',
				mode: 'cors',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json', // type de donnees renvoyees par le backend
					//ajouter la socket
				},
				body: JSON.stringify(data)   // donnees attendues par le backend
			},
		)
		return await response.json();
	}
	public async register(firstname: string, lastname: string, username: string, email: string, region: string, password: string): Promise<RegisterResponseSchema> {
		const data: RegisterSchema = { "firstname":firstname, "lastname": lastname, "username": username, "email": email, "region": region, "password": password };

		//cree l'url a partir des arguments qu'on lui donne, l'appelle pour acceder au server backend et il renvoie la reponse du server backend
		const response = await fetch(
			`${this.api_url}/auth/register`,
			{
				method: 'POST',
				mode: 'cors',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json', // type de donnees renvoyees par le backend
					//ajouter la socket
				},
				body: JSON.stringify(data)   // donnees attendues par le backend
			},
		)
		return await response.json();
	}
}

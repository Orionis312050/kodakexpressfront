import {CartItem, LoginDto, Order, ProductData, User, UserContext} from "../constants/Interfaces";

export class ManagerService {
    private static managerService: ManagerService;
    private uri: string = 'http://localhost:3001/'

    private constructor() {
    }

    public static getInstance(): ManagerService {
        if (!ManagerService.managerService) {
            ManagerService.managerService = new ManagerService();
        }
        return ManagerService.managerService;
    }

    public async getUserByEmail(email: string): Promise<User | undefined> {
        try {
            const response = await fetch(`${this.uri}customers/getbyemail?email=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer ' + token // Si vous gérez l'authentification JWT
                }
            });

            if (!response.ok) {
                if (response.status === 404) return undefined; // Utilisateur non trouvé
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            // NestJS renvoie généralement l'objet User directement ou dans un wrapper
            return await response.json();
        }
        catch(error) {
            console.error(`[ManagerService] Erreur API: `, error);
            throw error;
        }
    }

    public async verifyToken(): Promise<UserContext> {
        try {
            const response = await fetch(`${this.uri}customers/verify`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Session invalide ou expiré');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    public async login(loginDto: LoginDto): Promise<User> {
        try {
            const response = await fetch(`${this.uri}customers/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginDto)
            });

            if (!response.ok) {
                // Gérer les erreurs 401 (Unauthorized) etc.
                const error = await response.json();
                throw new Error(error.message || 'Échec de la connexion');
            }

            return await response.json(); // Retourne l'user (et potentiellement un token JWT)
        }
        catch(error) {
            console.error(`[ManagerService] Erreur API Login: `, error);
            throw error;
        }
    }

    public async logout(): Promise<User> {
        try {
            const response = await fetch(`${this.uri}customers/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Échec de la déconnexion');
            }

            return await response.json();
        }
        catch(error) {
            console.error(`[ManagerService] Erreur API Logout: `, error);
            throw error;
        }
    }

    public async registerUser(user: User) {
        try {
            console.log(`[ManagerService] Appel API NestJS: POST /auth/register`, user);

            const response = await fetch(`${this.uri}customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user) // Envoi des données du formulaire au format JSON
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la création du compte');
            }

            // Le backend NestJS renvoie le résultat de l'insertion (ex: insertId)
            const result = await response.json();
            // On retourne l'objet utilisateur complet avec le nouvel ID généré par la DB
            return { ...user, id: result.insertId || result.id };
        }
        catch(error) {
            console.error(`[ManagerService] Erreur API: `, error);
            throw error;
        }
    }

    public async getProducts(): Promise<ProductData[]> {
        try {
            const response = await fetch(`${this.uri}products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer ' + token // Si vous gérez l'authentification JWT
                }
            });

            if (!response.ok) {
                if (response.status === 404) return []; // Utilisateur non trouvé
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            // NestJS renvoie généralement l'objet User directement ou dans un wrapper
            return await response.json();
        }
        catch(error) {
            console.error(`[ManagerService] Erreur API: `, error);
            throw error;
        }
    }

    // POST /orders (Requiert authentification)
    public async createOrder(items: CartItem[], total: number): Promise<Order> {

        await new Promise(resolve => setTimeout(resolve, 500));

        // Décodage simulé pour récupérer l'ID user depuis le token
        const userId = ''; // Dans la réalité: req.user.id extrait du token

        return {
            id: Math.floor(Math.random() * 100000).toString(),
            status: 'En traitement',
            date: new Date().toLocaleDateString('fr-FR'),
            items: [...items],
            total: total
        };
    }

    public async getUserOrders(token: string): Promise<Order[]> {
        if (!token) throw new Error("Unauthorized");
        return [];
    }
}
import {
    CartItem,
    GeneratePresignedUrlDto,
    LoginDto,
    Order,
    ProductData,
    User,
    UserContext
} from "../constants/Interfaces";

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
        const response = await fetch(`${this.uri}customers/getbyemail?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' + token // Si vous gérez l'authentification JWT
            }
        });

        if (!response.ok) {
            if (response.status === 404) return undefined; // Utilisateur non trouvé
        }
        // NestJS renvoie généralement l'objet User directement ou dans un wrapper
        return await response.json();
    }

    public async verifyToken(): Promise<UserContext | null> {
        const response = await fetch(`${this.uri}customers/verify`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) return null;
        return await response.json();
    }

    public async login(loginDto: LoginDto): Promise<User | null> {
        const response = await fetch(`${this.uri}customers/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(loginDto)
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    }

    public async logout(): Promise<User | null> {
        const response = await fetch(`${this.uri}customers/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
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

    public async updateUser(user: User): Promise<User | null> {
        const response = await fetch(`${this.uri}customers/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user) // Envoi des données du formulaire au format JSON
        });

        if (!response.ok) {
            return null;
        }

        const { password, ...userWithoutPassword } = await response.json();
        return userWithoutPassword;
    }

    public async getProducts(): Promise<ProductData[]> {
        const response = await fetch(`${this.uri}products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' + token // Si vous gérez l'authentification JWT
            }
        });

        if (!response.ok) {
            return [];
        }

        // NestJS renvoie généralement l'objet User directement ou dans un wrapper
        return await response.json();
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
        return [];
    }

    public async generateUploadUrl(data: GeneratePresignedUrlDto): Promise<{ uploadUrl: string; key: string }> {
        try {
            const response = await fetch(`${this.uri}s3/generate-upload-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Erreur lors de la génération de l'URL d'upload");
            }

            return await response.json();
        } catch (error) {
            console.error(`[ManagerService] Erreur generateUploadUrl: `, error);
            throw error;
        }
    }

    public async deleteOrderFiles(userId: string, orderId: string): Promise<{ message: string }> {
        try {
            const response = await fetch(`${this.uri}s3/order/${userId}/${orderId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Erreur lors de la suppression des fichiers");
            }

            return await response.json();
        } catch (error) {
            console.error(`[ManagerService] Erreur deleteOrderFiles: `, error);
            throw error;
        }
    }
}
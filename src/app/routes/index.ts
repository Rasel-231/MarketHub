import express from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { productsRoutes } from '../modules/products/products.routes';
import { categoryRoutes } from '../modules/category/category.routes';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/products',
        route: productsRoutes
    },
    {
        path: '/categories',
        route: categoryRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;
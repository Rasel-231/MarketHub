import express from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { productsRoutes } from '../modules/products/products.routes';
import { categoryRoutes } from '../modules/category/category.routes';
import { orderRoutes } from '../modules/order/order.route';
import { cartRoutes } from '../modules/cart/cart.routes';
import { adminRoutes } from '../modules/admin/admin.routes';
import { reviewRoutes } from '../modules/review/review.routes';


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
        path: '/orders',
        route: orderRoutes
    },
    {
        path: '/carts',
        route: cartRoutes,
    },
    {
        path: '/products',
        route: productsRoutes
    },
    {
        path: '/admin',
        route: adminRoutes
    },
    {
        path: '/review',
        route: reviewRoutes
    },
    {
        path: '/categories',
        route: categoryRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;
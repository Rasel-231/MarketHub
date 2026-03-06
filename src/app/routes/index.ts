import express from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { productsRoutes } from '../modules/products/products.routes';
import { categoryRoutes } from '../modules/category/category.routes';
import { orderRoutes } from '../modules/order/order.route';
import { cartRoutes } from '../modules/cart/cart.routes';
import { adminRoutes } from '../modules/admin/admin.routes';
import { reviewRoutes } from '../modules/review/review.routes';
import { aiRoutes } from '../utils/AssistantAi/aiAssitant.route';
import { paymentRoutes } from '../modules/payment/payemtn.routes';
import { contactRoutes } from '../modules/contact/contact.routes';
import { wishlistRoutes } from '../modules/wishlist/wishlist.routes';
import { flagRoutes } from '../modules/productFlag/flag.routes';
import { attributesRoutes } from '../modules/attribute/attributes.routes';



const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/payment',
        route: paymentRoutes,
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
        path: '/wishlist',
        route: wishlistRoutes
        ,
    },
    {
        path: '/products',
        route: productsRoutes
    },
    {
        path: '/flag',
        route: flagRoutes
    },
    {
        path: '/attribute',
        route: attributesRoutes
    },
    {
        path: '/admin',
        route: adminRoutes
    },
    {
        path: '/assistant',
        route: aiRoutes
    },
    {
        path: '/contact/messages',
        route: contactRoutes
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
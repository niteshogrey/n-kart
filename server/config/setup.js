import AdminJs from 'adminjs'
import AdminJsExpress from '@adminjs/express'
import session from 'express-session'
import ConnectMongoDBSession from 'connect-mongodb-session';
import * as AdminJsMongoose from '@adminjs/mongoose'
import {dark, light, noSidebar} from '@adminjs/themes'
import Product from '../models/product.js';
import Order from '../models/order.js';
import User from '../models/user.js';
import Transaction from '../models/transaction.js';
import Category from '../models/category.js';

AdminJs.registerAdapter(AdminJsMongoose)

const DEFAULT_ADMIN = {
    email: "nitesh@gmail.com",
    password: "123456"
}

const authenticate = async(email, password ) =>{
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN)
    }
    return null
}

export const buildAdminJs = async(app) =>{
    const admin = new AdminJs({
        resources: [
            {resource: Product},
            {resource: Category},
            {resource: Order},
            {resource: User},
            {resource: Transaction},

        ],
        branding:{
            companyName: "N-Kart",
            withMadeWithLove: false,
        },
        defaultTheme: dark.id,
        availableThemes: [dark, light, noSidebar],
        rootPath: '/admin'
    })

    const MongoDBStore = ConnectMongoDBSession(session)
    const sessionStore = new MongoDBStore({
        uri: process.env.MONGO_URI,
        collection: 'sessions'
    })

    const adminRouter = AdminJsExpress.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: process.env.COOKIE_PASSWORD
        },
        null,
        {
            store: sessionStore,
            resave: true,
            saveUninitialized: true,
            secret: process.env.COOKIE_PASSWORD,
            cookie:{
                httpOnly: true,
                secure: false
            },
            name: 'adminjs'
        }
    )
    app.use(admin.options.rootPath, adminRouter)
}
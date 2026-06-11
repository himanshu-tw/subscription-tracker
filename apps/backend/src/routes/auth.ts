import express from 'express'

import { register, verify, login, me, logout } from '../controllers/auth.controller'

const router = express.Router()

router.post("/register", register)
router.post("/login", login)

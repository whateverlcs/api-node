const express = require('express')
const obrasRouter = require('./routes/obras-route.js')
const usuariosRouter = require('./routes/usuarios-route.js')
const authRouter = require('./routes/auth-route.js')
require('dotenv').config();

const app = express()
const port = process.env.PORT

app.use(express.json())

app.use('/auth', authRouter);
app.use('/obras', obrasRouter);
app.use('/usuarios', usuariosRouter);

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`)
})
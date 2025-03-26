const express = require('express')
const { openDb } = require('../database.js');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator');

const router = express.Router()

router.post('/login', async (req, res) => {
    try {
        const db = await openDb();
        const { email, senha } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'O e-mail inserido não é válido!' });
        }

        const usuario = await db.get(
            'SELECT * FROM Usuarios WHERE usu_email = ?', [email]
        );

        if (!usuario) {
            return res.status(400).json({ error: 'Usuário não existente.' });
        }

        const senhaCorreta = bcrypt.compareSync(senha, usuario.usu_senha);

        if (!senhaCorreta) {
            return res.status(400).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign(
            { id: usuario.usu_id, email: usuario.usu_email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro realizar a autenticação!' });
    }
})

module.exports = router;
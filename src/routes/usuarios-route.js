const express = require('express')
const { openDb } = require('../database.js');
const bcrypt = require('bcryptjs')
const { verificarToken } = require('../middlewares/authMiddleware.js')
const validator = require('validator');

const router = express.Router()

router.get('/', verificarToken, async (req, res) => {
    try {
        const db = await openDb();

        const usuarios = await db.all(
            'SELECT * FROM Usuarios'
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ message: 'Nenhum usuário encontrado!' });
        }

        res.status(200).json(usuarios);
    }
    catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro ao listar todos os usuários!' });
    }
})

router.post('/', verificarToken, async (req, res) => {
    try {
        const db = await openDb();
        const { nome, email, senha } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'O e-mail inserido não é válido!' });
        }

        const usuarioExiste = await db.get(
            'SELECT * FROM Usuarios WHERE usu_email = ?', [email]
        );

        if (usuarioExiste) {
            return res.status(400).json({ error: 'E-mail já está em utilização.' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const result = await db.run(
            'INSERT INTO usuarios (usu_nome, usu_email, usu_senha) VALUES (?, ?, ?)', [nome, email, senhaHash]
        );

        res.status(201).json({ message: 'Usuário criado com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro ao criar o usuário!' });
    }
})

router.put('/:id', verificarToken, async (req, res) => {
    try {
        const db = await openDb();
        const { id } = req.params;
        const { nome, email, senha } = req.body;

        const senhaHash = await bcrypt.hash(senha, 10);

        const result = await db.run(
            'UPDATE usuarios SET usu_nome = ?, usu_email = ?, usu_senha = ? WHERE usu_id = ?', [nome, email, senhaHash, id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro ao atualizar o usuário!' });
    }
})

router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const db = await openDb();
        const { id } = req.params;

        const result = await db.run(
            'DELETE FROM usuarios where usu_id = ?', [id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro ao excluir o usuário!' });
    }
})

module.exports = router;
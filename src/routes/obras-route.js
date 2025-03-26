const express = require('express')
const { openDb } = require('../database.js');
const { verificarToken } = require('../middlewares/authMiddleware.js')

const router = express.Router()

router.get('/', verificarToken, async (req, res) => {
    try {
        const db = await openDb();

        const obras = await db.all(
            'SELECT * FROM obras'
        );

        if (obras.length === 0) {
            return res.status(404).json({ message: 'Nenhuma obra encontrada!' });
        }

        res.status(200).json(obras);
    }
    catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro ao listar todas as obras!' });
    }
})

router.post('/', verificarToken, async (req, res) => {
    try {
        const db = await openDb();
        const { nome, status, tipo, descricao } = req.body;

        const result = await db.run(
            'INSERT INTO obras (obs_nome, obs_status, obs_tipo, obs_descricao) VALUES (?, ?, ?, ?)', [nome, status, tipo, descricao]
        );

        res.status(201).json({ message: 'Obra criada com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro ao criar a obra!' });
    }
})

router.put('/:id', verificarToken, async (req, res) => {
    try {
        const db = await openDb();
        const { id } = req.params;
        const { nome, status, tipo, descricao } = req.body;

        const result = await db.run(
            'UPDATE obras SET obs_nome = ?, obs_status = ?, obs_tipo = ?, obs_descricao = ?, obs_dataAtualizacao = datetime("now", "localtime") WHERE obs_id = ?', [nome, status, tipo, descricao, id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Obra não encontrada!' });
        }

        res.status(200).json({ message: 'Obra atualizada com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro ao atualizar a obra!' });
    }
})

router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const db = await openDb();
        const { id } = req.params;

        const result = await db.run(
            'DELETE FROM obras where obs_id = ?', [id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Obra não encontrada!' });
        }

        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro ao excluir a obra!' });
    }
})

module.exports = router;
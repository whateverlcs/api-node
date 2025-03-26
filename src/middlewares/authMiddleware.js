const jwt = require('jsonwebtoken')

function verificarToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Você não possui autorização!' });
    }

    try {
        const tokenSemBearer = token.replace('Bearer ', '');
        
        const tokenDecodificado = jwt.verify(tokenSemBearer, process.env.JWT_SECRET);
        
        req.user = tokenDecodificado;
        
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido!' });
    }
}

module.exports = { verificarToken };
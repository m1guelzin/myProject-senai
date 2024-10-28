// Importa o módulo Router do express
// Router será  utiliziado para definir rotas específicas da aplicação
const router = require('express').Router();

// Importa a controller onde contém a lógica relacionada a professores
const userController = require("../controllers/userController")


router.post('/user', userController.createUser);
//router.put('/user', userController.updateUser);
//router.delete('/user/:id', userController.deleteUser);
router.post('/login', userController.loginUser);

module.exports = router
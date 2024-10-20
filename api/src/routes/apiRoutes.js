// Importa o módulo Router do express
// Router será  utiliziado para definir rotas específicas da aplicação
const router = require('express').Router();

// Importa a controller onde contém a lógica relacionada a professores
const { route } = require('..');
const userController = require("../controllers/userController")


router.post('/user', userController.createUser);
//router.post('user/login', userController.postLogin);
router.get('/user', userController.getAllUsers);
//router.get('/user/:cpf', userController.gerUserById); 
router.put('/user', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

module.exports = router
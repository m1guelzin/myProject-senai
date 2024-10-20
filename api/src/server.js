//Importar a instancia do Express configurada em index.js
const app = require("./index");
//Inicia o servidor na porta 3000, neste caso a API será acessivel em http://localhost:3000/health/
app.listen(3000);
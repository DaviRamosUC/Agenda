require("dotenv").config();
const express = require("express");
//começo do servidor com express
const app = express();

//conexão com a base de dados mongodb usando library mongoose
const mongoose = require("mongoose");
mongoose
  .connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }) //retorna uma promessa
  .then(() => {
    console.log("Conectei a base de dados.");
    app.emit("pronto");
  })
  .catch((err) => {
    console.error(err);
  });

//Salva um cook no browser do cliente para reuso de dados;
const session = require("express-session");

//Indica que as seções vão ser salvas na base de dados;
const MongoStore = require("connect-mongo");

//Lib que envia uma mensagem instantânea e depois se some, usa seção como base;
const flashMessage = require("connect-flash");

//Utilizar sistema de rotas
const routes = require("./routes");

// Lib para trabalhar com os caminhos do projeto
const path = require("path");

//Previne vulnerabilidades e ataques por cabeçalho HTTP
const helmet = require("helmet");

// Tokens de validação de formulário, previne request de sites externos
const csrf = require("csurf");

// Uso dos middlewares que definimos na src/middlewares, funções que ficam no meio das rotas
const {
  middlewareGlobal,
  checkCsrfError,
  csrfMidlleware,
} = require("./src/middlewares/middleware");

// Começa usando a lib do helmet
app.use(helmet());

//Permite utilizar as var dos RESTFULL, ex: req.body || res.send
app.use(express.urlencoded({ extended: true }));

// Permite utilizar JSON em nossa aplicação
app.use(express.json());

//Importa o conteúdo estático HTML, CSS e etc para dentro do servidor
app.use(express.static(path.resolve(__dirname, "public")));

const sessionOptions = session({
  secret: "esteemeusecretparaoexpresssection",
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(flashMessage());

app.set("views", path.resolve(__dirname, "src", "views")); //Indicando a pasta views com os HTML's
app.set("view engine", "ejs"); //renderizador do HTML -> tem que dar um "npm i ejs"

app.use(csrf()); //Gerador de token para validar os forms

//Nossos próprios middlewares
app.use(middlewareGlobal); //Middleware criado para passar em todas as rotas e requisições
app.use(checkCsrfError); //Middleware criado para checkar csrf
app.use(csrfMidlleware);
app.use(routes);

//método on aguarda um estado ou sinal ocorrer para executar determinada função
app.on("pronto", () => {
  app.listen(3000, () => {
    console.log("Acessar http://localhost:3000");
    console.log("Servidor executando na porta 3000");
  }); // Inicializa o servidor na porta 3000
});

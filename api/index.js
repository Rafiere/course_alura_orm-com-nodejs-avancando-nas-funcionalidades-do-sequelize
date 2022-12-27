const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/index.js");

const app = express();
const port = 3000;

routes(app);

/* O Express estará escutando a porta 3000. */
app.listen(port, () => {
  console.log(`O servidor está sendo executado na porta ${port}.`);
});

module.exports = app;

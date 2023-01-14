const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04c185e59301c1cac0da65ee044253c3561e11194810197e951a1078a5122799358bfc90ca82069383679de0b83aa169e6c81c070151c703faabf7cb4ab60218fd": 100,
  "04ec3276b1d6bf97fc935f9d2b7de482c4e75b9c33906e8f033894af34307f960fac6dc0e3737eedfde9d316da1f926f9e2e4f9b6b2a0fb8dbf91f2345a63b6f83": 50,
  "047cc95f37f1a3204180a62521db3da8735c120a6c3e691684efbd98fdc3304ea8ba9ad6a9a62ab67e6aec8ab9ad1e8d41113bce2ea577f9861bf12b76a51755cf": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO : get a signature from the client 
  // then recover the public key from the signature
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

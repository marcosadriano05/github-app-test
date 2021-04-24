const express = require('express');
var jwt = require('jsonwebtoken');
const fs = require('fs')
const fetch = require('node-fetch');
const AuthUtils = require('./utils/AuthUtils.js');

const router = express.Router();

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;
let TOKEN = '';

const privateKey = fs.readFileSync('./repo-manager-app.2021-04-24.private-key.pem', 'utf8')

router.get('/login', (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}`
  res.redirect(url);
})

router.get('/oauth-callback', async (req, res) => {
  if (req.query.error) {
    return res.json(req.query);
  }

  const code = req.query.code;

  const token = await AuthUtils.getGithubAccessToken(code, client_id, client_secret);

  res.cookie('user_token', token.access_token);
  return res.json({ status: 'success', message: 'Login has alredy done'});
});

router.get('/user', async (req, res) => {
  const token = req.cookies['user_token'];
  
  const userData = await AuthUtils.getGithubUser(token);

  if (userData.message === "Bad credentials") {
    return res.send("Não autorizado")
  }

  const { login, id } = req.body;
  const tokenToAccess = createToken(login, id);

  res.cookie('token_access', tokenToAccess);

  return res.send(userData);
});

router.get('/logout', (req, res) => {
  res.cookie('user_token', { expires: Date.now() });
  res.send("Sessão encerrada");
});

function createToken(login, id) {
  try {
    const payload = { 
      login, id
    };

    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: 60 * 10
    }); 
  
    TOKEN = token;
    return token;
  } catch (error) {
    console.log(error);
    return '';
  }
}

router.post('/create', async (req, res) => {
  const { repoName } = req.body;
  const accessToken = req.cookies['token_access']
  console.log("token", TOKEN);

  const request = await fetch(`https://api.github.com/user/repos`, {
    method: 'POST',
    headers: {
      accept: "application/vnd.github.v3+json",
      authorization: `bearer ${TOKEN}`
    },
    body: {
      name: repoName,
      description: "Criado",
      homepage: "https://github.com",
      private: false
    }
  });

  const data = await request.json();
  return res.send(data);
});

module.exports = router;
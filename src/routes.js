const express = require('express');
const AuthUtils = require('./utils/AuthUtils.js');

const router = express.Router();

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;

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

  return res.send(userData);
});
/*
router.get('/logout', (req, res) => {
  req.cookie('user_token', { expires: Date.now() });
  console.log(token);
  res.send("Sessão encerrada");
});
*/
module.exports = router;
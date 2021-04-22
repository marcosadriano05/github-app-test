const fetch = require('node-fetch');

const getGithubAccessToken = async (code, client_id, client_secret) => {
  const res = await fetch(`https://github.com/login/oauth/access_token`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code
    })
  });

  const data = await res.text();
  
  const params = new URLSearchParams(data);
  console.log("params", params);
  const access_token = params.get('access_token');

  const token_type = params.get('token_type');

  return { access_token, token_type };
}

const getGithubUser = async (access_token) => {
  const req = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `bearer ${access_token}`
    }
  })

  const data = await req.json()
  return data
}

module.exports = {
  getGithubAccessToken,
  getGithubUser
}
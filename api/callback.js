module.exports = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method:  'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      client_id:     process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const { access_token, error, error_description } = await tokenRes.json();

  const msg = error
    ? `authorization:github:error:${JSON.stringify({ error: error_description || error })}`
    : `authorization:github:success:${JSON.stringify({ token: access_token, provider: 'github' })}`;

  res.setHeader('Content-Type', 'text/html');
  res.end(`<!DOCTYPE html><html><body><script>
    (function(){
      var msg = ${JSON.stringify(msg)};
      window.opener.postMessage(msg, '*');
      setTimeout(function(){ window.close(); }, 500);
    })();
  </script></body></html>`);
};

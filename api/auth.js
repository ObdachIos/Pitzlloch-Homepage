module.exports = (req, res) => {
  const host  = req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${proto}://${host}/api/callback`;

  const params = new URLSearchParams({
    client_id:    process.env.GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope:        'repo,user',
  });

  res.redirect(302, `https://github.com/login/oauth/authorize?${params}`);
};

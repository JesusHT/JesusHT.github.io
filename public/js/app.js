const particle     = new Particle();
const input        = document.getElementById('lightSwitch');
const functionName = 'led';

async function login() {
  try {
    const data = await particle.login({ username: credentials.user, password: credentials.password });
    return data.body.access_token;
  } catch (err) {
    console.log('Could not log in.', err);
    throw err; 
  }
}

input.addEventListener('change', async () => {
  const token = await login();
  const isChecked = input.checked;
  const value = isChecked ? '1' : '0';

  try {    
    await particle.callFunction({ 
      deviceId: deviceId, 
      name: functionName,
      argument: value, 
      auth: token,
    });
  } catch (err) {
    console.log('Error occurred while calling function:', err);
  }
});
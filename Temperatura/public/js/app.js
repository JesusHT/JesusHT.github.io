const TempElement = document.querySelector('#Temperatura span');
const HumElement  = document.querySelector('#Humedad span');
const emoji       = document.querySelector('.emoji');
const tempOutput  = document.querySelector('.temperature-output')
const particle    = new Particle();
const slider      = document.querySelector('.slider');

let token;

// Iniciar sesión en Particle API
async function login() {
    try {
        const data = await particle.login({username: credentials.user, password: credentials.password});
        token = data.body.access_token;
    } catch (err) {
        console.log('Could not log in.', err);
    }
}

// Obtener variables de temperatura y humedad
async function getVariables() {
    try {
        const tempResponse = await particle.getVariable({deviceId: deviceId, name: 'Temp', auth: token});
        const humResponse  = await particle.getVariable({deviceId: deviceId, name: 'Hum', auth: token});
        
        const temp = tempResponse.body.result.toFixed(2);
        const hum  = humResponse.body.result.toFixed(2);

        TempElement.textContent = `${temp} °C`;
        HumElement.textContent  = `${hum} %`;

        // Llama a displayTemp con la temperatura obtenida
        displayTemp(temp);

    } catch (err) {
        console.log('An error occurred while getting variables:', err);
    }
}

// Actualizar los valores de temperatura y humedad cada 60 segundos
async function updateData() {
    await login();
    getVariables();
    setInterval(getVariables, 60000); // Actualiza cada 60 segundos
}

const displayTemp = temperature => {
   //Display temperature
   tempOutput.textContent = `${temperature}`;
   slider.value = temperature;

   //Display emoji
   if (temperature >= 0 && temperature <= 8) {
       emoji.textContent = '🥶';
       emoji.setAttribute('aria-label', 'freezing face');
   } else if (temperature > 8 && temperature <= 16) {
       emoji.textContent = '😬';
       emoji.setAttribute('aria-label', 'cold face');
   } else if (temperature > 16 && temperature <= 24) {
       emoji.textContent = '😊';
       emoji.setAttribute('aria-label', 'happy face');
   } else if (temperature > 24 && temperature <= 32) {
       emoji.textContent = '😅';
       emoji.setAttribute('aria-label', 'warm face');
   } else {
       emoji.textContent = '🥵';
       emoji.setAttribute('aria-label', 'hot face');
   }         
}

updateData();
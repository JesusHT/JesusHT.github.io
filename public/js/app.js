/**
 * Instancia de la clase Particle para interactuar con la API de Particle.
 * @type {Particle}
 */
const particle = new Particle();

/**
 * Referencia al slider HTML que se usa para ajustar el valor de TMS.
 * @type {HTMLInputElement}
 */
const slider = document.querySelector('#tms');

/**
 * Referencia al elemento HTML que muestra el valor inicial de TMS.
 * @type {HTMLElement}
 */
const initialTMSValueElement = document.querySelector('#initialTMSValue');

/**
 * Referencia al elemento HTML que muestra el nuevo valor de TMS.
 * @type {HTMLElement}
 */
const newTMSValueElement = document.querySelector('#newTMSValue');

/**
 * Token de acceso para autenticar las solicitudes a la API de Particle.
 * @type {string|undefined}
 */
let token;

/**
 * Inicia sesión en la API de Particle usando las credenciales proporcionadas.
 *
 * @async
 * @function login
 * @throws {Error} Lanza un error si no se puede iniciar sesión.
 */
async function login() {
    try {
        const data = await particle.login({ username: credentials.user, password: credentials.password });
        token = data.body.access_token;
    } catch (err) {
        console.log('Could not log in.', err);
        throw err;
    }
}

/**
 * Obtiene el nuevo valor de TMS del dispositivo y lo actualiza en la interfaz de usuario.
 *
 * @async
 * @function getNewTMSValue
 * @throws {Error} Lanza un error si ocurre un problema al obtener el valor.
 */
async function getNewTMSValue() {
    try {
        const response = await particle.getVariable({ deviceId: deviceId, name: 'TMS_Value', auth: token });
        newTMSValueElement.textContent = response.body.result;
    } catch (err) {
        console.log('An error occurred while getting initial TMS value:', err);
    }
}

/**
 * Obtiene el valor de TMS del dispositivo y actualiza el slider y la interfaz de usuario.
 *
 * @async
 * @function getTMSValue
 * @throws {Error} Lanza un error si ocurre un problema al obtener el valor.
 */
async function getTMSValue() {
    try {
        const response = await particle.getVariable({ deviceId: deviceId, name: 'TMS_Value', auth: token });
        const tmsValue = response.body.result;
        
        // Actualizar el valor del slider y la interfaz de usuario
        slider.value = tmsValue; // Ajustar el slider al valor recuperado
        initialTMSValueElement.textContent = tmsValue;
        new UnicycleRangeSlider("#unicycle1");
    } catch (err) {
        console.log('An error occurred while getting initial TMS value:', err);
    }
}

/**
 * Actualiza el valor de TMS en el dispositivo según el valor del slider y actualiza la interfaz de usuario.
 *
 * @async
 * @function updateTMSValue
 * @throws {Error} Lanza un error si ocurre un problema al llamar a la función del dispositivo.
 */
async function updateTMSValue() {
    try {
        const value = slider.value;
        await particle.callFunction({
            deviceId: deviceId,
            name: 'set_TMS',
            argument: value,
            auth: token
        });

        // Actualizar el valor nuevo en la interfaz de usuario
        initialTMSValueElement.textContent = value;
    } catch (err) {
        console.log('Error occurred while calling function:', err);
    }
}

// Configurar eventos y actualización al cargar el documento.
document.addEventListener("DOMContentLoaded", async () => {
    await login(); // Iniciar sesión
    await getTMSValue(); // Obtener el valor inicial de TMS
    
    // Actualizar el valor cuando cambie el slider
    slider.addEventListener('change', async () => {
        await updateTMSValue(); // Actualizar valor de TMS en el dispositivo
        await getNewTMSValue(); // Obtener el valor inicial de TMS
    });
});
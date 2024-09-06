/**
 * Instance of the Particle class for interacting with the Particle API.
 * @type {Particle}
 */
const particle = new Particle();

/**
 * Reference to the HTML slider used for adjusting the TMS value.
 * @type {HTMLInputElement}
 */
const slider = document.querySelector('#tms');

/**
 * Reference to the HTML element that displays the initial TMS value.
 * @type {HTMLElement}
 */
const initialTMSValueElement = document.querySelector('#initialTMSValue');

/**
 * Reference to the HTML element that shows the new TMS value.
 * @type {HTMLElement}
 */
const newTMSValueElement = document.querySelector('#newTMSValue');

/**
 * Access token for authenticating requests to the Particle API.
 * @type {string|undefined}
 */
let token;

/**
 * Logs in to the Particle API using provided credentials.
 *
 * @async
 * @function login
 * @throws {Error} Throws an error if login fails.
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
 * Retrieves the new TMS value from the device and updates the user interface.
 *
 * @async
 * @function getNewTMSValue
 * @throws {Error} Throws an error if there is an issue retrieving the value.
 */
async function getNewTMSValue() {
    try {
        const response = await particle.getVariable({ deviceId: deviceId, name: 'TMS_Value', auth: token });
        newTMSValueElement.textContent = response.body.result;
    } catch (err) {
        console.log('An error occurred while getting new TMS value:', err);
    }
}

/**
 * Retrieves the TMS value from the device, updates the slider, and updates the user interface.
 *
 * @async
 * @function getTMSValue
 * @throws {Error} Throws an error if there is an issue retrieving the value.
 */
async function getTMSValue() {
    try {
        const response = await particle.getVariable({ deviceId: deviceId, name: 'TMS_Value', auth: token });
        const tmsValue = response.body.result;
        
        // Update the slider and the user interface with the retrieved value
        slider.value = tmsValue; // Set the slider to the retrieved value
        initialTMSValueElement.textContent = tmsValue;
        new UnicycleRangeSlider("#unicycle1");
    } catch (err) {
        console.log('An error occurred while getting initial TMS value:', err);
    }
}

/**
 * Updates the TMS value on the device according to the slider value and updates the user interface.
 *
 * @async
 * @function updateTMSValue
 * @throws {Error} Throws an error if there is an issue calling the device function.
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

        // Update the new value in the user interface
        initialTMSValueElement.textContent = value;
    } catch (err) {
        console.log('Error occurred while calling function:', err);
    }
}

// Set up event listeners and updates when the document is loaded.
document.addEventListener("DOMContentLoaded", async () => {
    await login(); // Log in to the API
    await getTMSValue(); // Retrieve the initial TMS value
    
    // Update the TMS value when the slider changes
    slider.addEventListener('change', async () => {
        await updateTMSValue(); // Update the TMS value on the device
        await getNewTMSValue(); // Retrieve and display the new TMS value
    });
});

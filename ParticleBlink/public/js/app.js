const beam = document.querySelector('.beam');
const lamp = document.querySelector('.lamp');
const lampToggle = document.getElementById('lampToggle');
const speedControl = document.getElementById('speedControl');

// Configuración inicial de las animaciones
let swingAnimation;
let lampRotationAnimation;

// Función para actualizar la animación en función de la velocidad
function updateAnimations() {
  const speed = speedControl.value;
  const duration = 10 / speed; // Ajusta la duración de la animación según la velocidad

  // Limpiar animaciones anteriores
  if (swingAnimation) swingAnimation.kill();
  if (lampRotationAnimation) lampRotationAnimation.kill();

  // Configurar animación del haz
  swingAnimation = gsap.fromTo(beam, 
    { '--swing': '0.97turn' }, 
    { 
      '--swing': '1.03turn',
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    }
  );

  // Configurar animación de rotación de la lámpara
  lampRotationAnimation = gsap.fromTo(lamp, 
    { rotate: '-8.5deg' }, 
    { 
      rotate: '8.5deg',
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    }
  );
}

// Función para actualizar el estado de la lámpara y el haz de luz
function updateLampState() {
  if (lampToggle.checked) {
    beam.classList.add('active');
    beam.style.setProperty('--light', 'transparent');

    // Reanudar animación de la lámpara si está encendida
    if (lampRotationAnimation) {
      lampRotationAnimation.play();
    }

    // Reanudar animación del haz si está encendido
    if (swingAnimation) {
      swingAnimation.play();
    }
  } else {
    beam.classList.remove('active');
    beam.style.setProperty('--light', 'hsla(0, 0%, 0%, 0.95)');

  }
}

// Escuchar cambios en el control de velocidad
speedControl.addEventListener('input', () => {
  updateAnimations();
  updateLampState(); // Asegúrate de que las animaciones se actualicen si la lámpara está encendida
});

// Escuchar cambios en el checkbox de encendido/apagado
lampToggle.addEventListener('change', updateLampState);

// Inicializar las animaciones y el estado de la lámpara
function initialize() {
  // Asegúrate de que el interruptor de la lámpara esté desmarcado por defecto
  lampToggle.checked = false;

  // Configura el estado inicial de la lámpara y las animaciones
  updateLampState();
  updateAnimations();
}

// Inicializar las animaciones y el estado de la lámpara
initialize();

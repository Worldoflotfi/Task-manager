// script.js
const layer = document.getElementById('layer');
const startButton = document.getElementById('startAnimation');

// Inputs
const colorInput = document.getElementById('layerColor');
const widthInput = document.getElementById('layerWidth');
const heightInput = document.getElementById('layerHeight');
const textInput = document.getElementById('layerText');
const opacityInput = document.getElementById('layerOpacity');
const horizontalDirectionInput = document.getElementById('horizontalDirection');
const verticalDirectionInput = document.getElementById('verticalDirection');
const trajectoryInput = document.getElementById('trajectory');

// Animation parameters
let dx = 2; // Horizontal speed
let dy = 2; // Vertical speed
let animationId;

// Fonction pour mettre à jour la configuration du calque
function updateLayerConfig() {
  // Appliquer les configurations au calque
  layer.style.backgroundColor = colorInput.value || '#ff0000';
  layer.style.width = (widthInput.value || 100) + 'px';
  layer.style.height = (heightInput.value || 100) + 'px';
  layer.innerText = textInput.value || 'Calque';
  layer.style.opacity = opacityInput.value || 1;

  // Initialiser les directions
  dx = horizontalDirectionInput.value === 'right' ? 2 : -2;
  dy = verticalDirectionInput.value === 'down' ? 2 : -2;
}

// Fonction pour animer le calque
function animateLayer() {
  const layerRect = layer.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Déterminer le trajet
  if (trajectoryInput.value === 'horizontal') dy = 0;
  if (trajectoryInput.value === 'vertical') dx = 0;

  // Détection des rebonds sur les bords
  if (layerRect.left <= 0 || layerRect.right >= windowWidth) dx *= -1;
  if (layerRect.top <= 0 || layerRect.bottom >= windowHeight) dy *= -1;

  // Mise à jour des positions
  layer.style.left = (layer.offsetLeft + dx) + 'px';
  layer.style.top = (layer.offsetTop + dy) + 'px';

  // Requête pour continuer l'animation
  animationId = requestAnimationFrame(animateLayer);
}

// Démarrer l'animation au clic sur le bouton
startButton.addEventListener('click', () => {
  updateLayerConfig(); // Appliquer la configuration du calque
  cancelAnimationFrame(animationId); // Réinitialiser toute animation en cours
  animateLayer(); // Commencer l'animation
});

// Initialisation de la position du calque
layer.style.left = '10px';
layer.style.top = '10px';

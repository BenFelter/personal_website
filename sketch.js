let player;
let settings;
let cam;
let platforms = [];
let sprites = {};
let maps = [];
let currentMapIndex = 0;
let fadeEffect = { fade: false, alpha: 0, fadingIn: true };

function preload() {
  // Load the sprite sheet
  spriteSheet = loadImage('ben_sprite_sheet.png', () => {
    console.log('Loaded ben_sprite_sheet.png');
    initializeSprites();
  });

  pixelifyFont = loadFont('path/to/Sans.ttf');

  // Load map images
  maps.push(loadImage('home_pixel_map.png', () => console.log('Loaded home_pixel_map.png')));
  maps.push(loadImage('rowing_pixel_map.png', () => console.log('Loaded rowing_pixel_map.png')));
  maps.push(loadImage('stanford_pixel_map.png', () => console.log('Loaded stanford_pixel_map.png')));

  // Show initial dialogue
  showDialogue(['home', 'rowing', 'stanford'][currentMapIndex]);
}

function initializeSprites() {
  // Define function to extract frames from the sprite sheet
  function extractFrames(sheet, row, cols, frameWidth, frameHeight) {
    let frames = [];
    for (let i = 0; i < cols; i++) {
      frames.push(sheet.get(i * frameWidth, row * frameHeight, frameWidth, frameHeight));
    }
    return frames;
  }

  // Assuming each frame is of uniform size and sprite sheet is a grid of frames
  let frameWidth = spriteSheet.width / 13;
  let frameHeight = spriteSheet.height / 46;

  // Extract frames for running
  sprites.runRight = extractFrames(spriteSheet, 11, 9, frameWidth, frameHeight);
  sprites.runLeft = extractFrames(spriteSheet, 9, 9, frameWidth, frameHeight);
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('gameContainer');  // Attach the canvas to the gameContainer div
  noSmooth();  // Disable image smoothing to maintain pixel sharpness

  // Initialize settings
  settings = {
    gravity: createVector(0, 0.5),
    worldWidth: windowWidth,  // Adjust to window width
    worldHeight: windowHeight  // Adjust to window height
  };

  // Initialize player
  player = new Player(settings, 100, settings.worldHeight - 200, 150, 200, sprites);

  // Initialize camera
  cam = createVector(0, 0);
}

function draw() {
  background(220);

  // Draw the current map
  image(maps[currentMapIndex], 0, 0, settings.worldWidth, settings.worldHeight);

  // Update the player's position
  player.update();

  // Check for map transition or end condition
  if (player.pos.x > settings.worldWidth * 0.75) {
    if (!fadeEffect.fade) {
      fadeEffect.fade = true;
      fadeEffect.fadingIn = false;
    } else if (fadeEffect.fade && !fadeEffect.fadingIn && fadeEffect.alpha >= 255) {
      if (currentMapIndex < maps.length - 1) {
        player.pos.x = settings.worldWidth * 0.25;
        currentMapIndex = (currentMapIndex + 1) % maps.length;
        showDialogue(['home', 'rowing', 'stanford'][currentMapIndex]);
      } else {
        // Hide the game canvas and show the website content
        document.getElementById('gameContainer').style.display = 'none';
        document.getElementById('websiteContent').style.display = 'block';
        noLoop();  // Stop the draw loop
      }
      fadeEffect.fadingIn = true;
    }
  }

  // Update the camera to follow the player
  updateCamera();

  // Translate the world based on the camera position
  push();
  translate(-cam.x, -cam.y);

  // Draw the world boundaries
  stroke(0);
  noFill();
  rect(0, 0, settings.worldWidth, settings.worldHeight);

  // Render platforms and their labels if player is near
  platforms.forEach(platform => {
    platform.show();
    if (player.pos.x > platform.pos.x - windowWidth / 2 && player.pos.x < platform.pos.x + platform.width + windowWidth / 2) {
      platform.displayLabel();
    }
  });

  // Show the player
  player.show();

  pop();

  // Display controls at the beginning
  if (player.pos.x < 200) {
    displayControls();
  }

  // Handle fade effect
  if (fadeEffect.fade) {
    if (fadeEffect.fadingIn) {
      fadeEffect.alpha -= 10;
      if (fadeEffect.alpha <= 0) {
        fadeEffect.alpha = 0;
        fadeEffect.fade = false;
      }
    } else {
      fadeEffect.alpha += 10;
    }
  }

  // Draw the fade effect
  fill(0, fadeEffect.alpha);
  rect(0, 0, width, height);

  // Debug information
  fill(0);
  noStroke();
  // text(`Player X: ${player.pos.x}`, 10, 20);
  // text(`Player Y: ${player.pos.y}`, 10, 40);
  // text(`Camera X: ${cam.x}`, 10, 60);
  // text(`Camera Y: ${cam.y}`, 10, 80);
}

function displayControls() {
  fill(255, 255, 255, 200); // Semi-transparent white
  noStroke();
  rect(5, 80, 250, 140, 10); // Rounded corners (last parameter is the radius)

  fill(0); // Black text color
  textSize(20);
  textAlign(LEFT);
  textFont(pixelifyFont); // Apply the loaded font
  text("Controls:", 10, 100);
  text("Move left: A", 10, 130);
  text("Move right: D", 10, 160);
  text("Jump: W or Space", 10, 190);
}

function updateCamera() {
  // Center the camera on the player
  cam.x = player.pos.x - windowWidth / 2 + player.width / 2;
  cam.y = player.pos.y - windowHeight / 2 + player.height / 2;

  // Constrain the camera to the world bounds
  cam.x = constrain(cam.x, 0, settings.worldWidth - windowWidth);
  cam.y = constrain(cam.y, 0, settings.worldHeight - windowHeight);
}

function keyPressed() {
  if (key === 'a' || key === 'A') {
    player.move('left', true);
  } else if (key === 'd' || key === 'D') {
    player.move('right', true);
  } else if (key === 'w' || key === 'W' || key === ' ') {
    player.move('up', true);
  }
}

function keyReleased() {
  if (key === 'a' || key === 'A') {
    player.move('left', false);
  } else if (key === 'd' || key === 'D') {
    player.move('right', false);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  settings.worldWidth = windowWidth;  // Adjust to new window width
  settings.worldHeight = windowHeight;  // Adjust to new window height
}

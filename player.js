class Player {
  constructor(settings, x, y, width, height, sprites) {
    this.settings = settings;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.width = width;
    this.height = height;
    this.maxVel = 8;
    this.direction = { left: false, right: false };
    this.onGround = false;
    this.state = 'stand'; // stand, run
    this.sprites = sprites;
    this.runFrame = 0;
    this.lastDirection = 'right';
  }

  show() {
    const { pos, width, height, state, sprites, runFrame, lastDirection } = this;
    let sprite;

    if (state === 'stand') {
      sprite = lastDirection === 'right' ? sprites.runRight[0] : sprites.runLeft[0];
    } else if (state === 'run') {
      if (this.direction.left) {
        sprite = sprites.runLeft[runFrame];
      } else if (this.direction.right) {
        sprite = sprites.runRight[runFrame];
      }
    }

    if (sprite) {
      image(sprite, pos.x, pos.y, width, height);
    } else {
      console.error('Sprite is undefined:', state);
    }
  }

  update() {
    const { settings, acc, vel, pos, direction, maxVel } = this;

    // Apply gravity
    acc.add(settings.gravity);

    // Apply horizontal movement based on user input
    if (direction.left) {
      vel.x = -maxVel;
      this.state = 'run';
      this.lastDirection = 'left';
    } else if (direction.right) {
      vel.x = maxVel;
      this.state = 'run';
      this.lastDirection = 'right';
    } else {
      vel.x = 0;
      if (this.state === 'run') {
        this.state = 'stand';
      }
    }

    // Update velocity
    vel.add(acc);
    acc.set(0, 0);

    // Move incrementally and check for collisions
    let steps = 10; // Smaller step for better collision detection
    for (let i = 0; i < steps; i++) {
      pos.x += vel.x / steps;
      if (this.checkPlatformCollisions()) {
        pos.x -= vel.x / steps;
        vel.x = 0;
      }

      pos.y += vel.y / steps;
      if (this.checkPlatformCollisions()) {
        pos.y -= vel.y / steps;
        vel.y = 0;
        if (vel.y >= 0) { // Only set onGround if falling
          this.onGround = true;
        }
      }
    }

    // Check if the player is on the ground or a platform
    if (pos.y >= settings.worldHeight - this.height) {
      this.vel.y = 0;
      this.pos.y = settings.worldHeight - this.height;
      this.onGround = true;
      console.log('Landed on ground');
    } else if (!this.checkPlatformCollisions()) {
      this.onGround = false;
    }

    // Constrain position to world boundaries
    this.constrainPosition();

    // Update run frame for animation
    if (this.state === 'run') {
      if (frameCount % 10 === 0) { // Adjust frame rate for animation speed
        this.runFrame = (this.runFrame + 1) % this.sprites.runRight.length;
      }
    }

    // Debugging information
    console.log(`Player state: ${this.state}, onGround: ${this.onGround}`);
    console.log(`Player position: x=${pos.x}, y=${pos.y}`);
  }

  checkPlatformCollisions() {
    let collision = false;

    platforms.forEach(platform => {
      // Check for collision with the top of the platform
      if (
        this.pos.x < platform.pos.x + platform.width &&
        this.pos.x + this.width > platform.pos.x &&
        this.pos.y + this.height <= platform.pos.y &&
        this.pos.y + this.height + this.vel.y >= platform.pos.y
      ) {
        if (this.vel.y > 0) { // Ensure only when falling
          this.pos.y = platform.pos.y - this.height;
          this.vel.y = 0;
          collision = true;
          this.onGround = true;
          console.log('Collision with top of platform', platform.id);
        }
      }
    });

    return collision;
  }

  constrainPosition() {
    const { pos, vel, settings } = this;

    const maxX = settings.worldWidth - this.width;
    if (pos.x < 0) {
      pos.x = 0;
    }
    if (pos.x > maxX) {
      pos.x = maxX;
    }

    const maxY = settings.worldHeight - this.height;
    if (pos.y < 0) {
      pos.y = 0;
      vel.y = 0;
    }
    if (pos.y > maxY) {
      pos.y = maxY;
      vel.y = 0;
    }
  }

  move(direction, isMoving) {
    if (direction === 'left' || direction === 'right') {
      this.direction[direction] = isMoving;
    } else if (direction === 'up' && this.onGround) {
      const jump = createVector(0, -15);
      this.vel.add(jump);
      this.onGround = false;
    }
  }
}

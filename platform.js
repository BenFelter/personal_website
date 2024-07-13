class Platform {
  constructor(x, y, width, height, color, id) {
    this.pos = createVector(x, y);
    this.width = width;
    this.height = height;
    this.color = color;
    this.id = id;
  }

  show() {
    fill(this.color);
    rect(this.pos.x, this.pos.y, this.width, this.height);
  }

  displayLabel() {
    fill(0);
    textSize(20);
    textAlign(CENTER);
    text(`Platform ${this.id}`, this.pos.x + this.width / 2, this.pos.y - 10);
  }
}

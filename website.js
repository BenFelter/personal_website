document.addEventListener('DOMContentLoaded', function () {
    const skipButton = document.getElementById('skipButton');
    const gameContainer = document.getElementById('gameContainer');
    const websiteContent = document.getElementById('websiteContent');

    skipButton.addEventListener('click', function () {
        gameContainer.style.display = 'none';
        websiteContent.style.display = 'block';
        noLoop();  // Stop the p5.js draw loop
    });

    // Initialize p5.js for particle animation
    new p5(p => {
        let particles = [];
        let font;
        let points;
        let bounds;

        p.preload = () => {
            font = p.loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
        };

        p.setup = () => {
            const canvas = p.createCanvas(p.windowWidth, 150).parent('particleContainer');
            canvas.style('margin-top', '50px'); // Add top margin to the canvas
            p.textFont(font);
            p.textSize(64);
            p.fill(255);

            // Calculate the bounding box of the text
            let bounds = font.textBounds("hi, i'm ben", 0, 0, 64);

            // Center the text by adjusting the starting x and y positions
            let startX = ((p.width - bounds.w) / 2) - bounds.x * 5;
            let startY = (p.height + bounds.h) / 2;

            points = font.textToPoints("hi, i'm ben", startX, startY, 64, {
                sampleFactor: 0.19 // Increased density of points
            });

            for (let i = 0; i < points.length; i++) {
                let pt = points[i];
                particles.push(new Particle(pt.x, pt.y, p));
            }
        };

        p.draw = () => {
            p.background('#121212'); // Use the specified background color
            for (let i = 0; i < particles.length; i++) {
                let particle = particles[i];
                particle.behaviors();
                particle.update();
                particle.show();
            }
        };

        class Particle {
            constructor(x, y, p) {
                this.p = p;
                this.pos = p.createVector(p.random(p.width), p.random(p.height));
                this.target = p.createVector(x, y);
                this.vel = p.createVector();
                this.acc = p.createVector();
                this.r = 4;
                this.maxspeed = 8;  // Reduced maximum speed
                this.maxforce = 0.5;  // Reduced maximum force
            }

            behaviors() {
                let arrive = this.arrive(this.target);
                let mouse = this.p.createVector(this.p.mouseX, this.p.mouseY);
                let flee = this.flee(mouse);

                arrive.mult(1);
                flee.mult(5);

                this.applyForce(arrive);
                this.applyForce(flee);
            }

            applyForce(f) {
                this.acc.add(f);
            }

            update() {
                this.pos.add(this.vel);
                this.vel.add(this.acc);
                this.acc.mult(0);
            }

            show() {
                this.p.stroke(255);
                this.p.strokeWeight(this.r);
                this.p.point(this.pos.x, this.pos.y);
            }

            arrive(target) {
                let desired = p5.Vector.sub(target, this.pos);
                let d = desired.mag();
                let speed = this.maxspeed;
                if (d < 100) {
                    speed = p.map(d, 0, 100, 0, this.maxspeed);
                }
                desired.setMag(speed);
                let steer = p5.Vector.sub(desired, this.vel);
                steer.limit(this.maxforce);
                return steer;
            }

            flee(target) {
                let desired = p5.Vector.sub(target, this.pos);
                let d = desired.mag();
                if (d < 50) {
                    desired.setMag(this.maxspeed);
                    desired.mult(-1);
                    let steer = p5.Vector.sub(desired, this.vel);
                    steer.limit(this.maxforce);
                    return steer;
                } else {
                    return this.p.createVector(0, 0);
                }
            }
        }

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, 300);
            particles = [];
            p.setup();  // Redo setup to adjust the text position
        };
    });

    // Expand/Collapse functionality
    document.querySelectorAll('.expandable').forEach(item => {
        item.addEventListener('click', () => {
            const content = item.querySelector('.content');
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });
});

// Tab switching functionality
function showTabContent(tabId) {
    const tabs = document.querySelectorAll('.tabContent');
    const tabButtons = document.querySelectorAll('.tabButton');

    tabs.forEach(tab => {
        tab.style.display = 'none';
    });

    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(tabId).style.display = 'block';
    document.querySelector(`[onclick="showTabContent('${tabId}')"]`).classList.add('active');
}

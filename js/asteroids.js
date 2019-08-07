var AsteroidsGame = {
    canvas: null,
    ctx: null,
    options: {},
    requestId: null,
    defaultOptions: {
        canvasId: "canvas",
        fps: 60,
    },
    spaceShip: null,

    init: function () {
        this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
        this.onKeyUpHandler = this.onKeyUpHandler.bind(this);

        return this;
    },

    start: function (optionsArg = {}) {
        this.options = Object.assign(this.defaultOptions, optionsArg);

        this.removeKeyEvents();
        cancelAnimationFrame(this.requestId);

        this.canvas = document.getElementById(this.options.canvasId);
        if (!this.canvas || this.canvas.nodeName != "CANVAS") {
            throw "No canvas found or found element is not canvas"
        }

        this.draw = this.draw.bind(this);

        this.ctx = this.canvas.getContext('2d');
        this.spaceShip = new SpaceShip(this.ctx,this.canvas.width/2, this.canvas.height/2);

        this.requestId = requestAnimationFrame(this.draw)

        this.bindKeyEvents()
    },

    draw: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.spaceShip.draw()
        this.requestId = requestAnimationFrame(this.draw)
    },

    onKeyDownHandler: function (e) {
        e.preventDefault();
        this.spaceShip.start(e.keyCode, e.repeat);
    },

    onKeyUpHandler: function (e) {
        e.preventDefault();
        this.spaceShip.stop(e.keyCode);
    },

    bindKeyEvents: function () {
        document.addEventListener('keydown', this.onKeyDownHandler);
        document.addEventListener('keyup', this.onKeyUpHandler);
    },

    removeKeyEvents: function () {
        document.removeEventListener('keydown', this.onKeyDownHandler);
        document.removeEventListener('keyup', this.onKeyUpHandler);
    }
}.init();


function SpaceShip(ctx, x, y) {
    var self = this;

    self.ctx = ctx;

    self.state = {

    }

    self.x = x || 0;
    self.y = y || 0;
    self.angle = 0;
    self.vAngle = (Math.PI / 2);

    var step = 1;
    var stepX = stepY = 0;
    var a = 10;
    var h = 20;
    self.draw = function () {
        self.updateCoords();
        let ctx = self.ctx;
        ctx.save();
        let r = (1.0 / 8.0) * (a * a / h) + 0.5 * h;
        ctx.translate(self.x + 0.5 * a, self.y - (h - r));
        ctx.rotate(self.angle);
        ctx.translate(-(self.x + 0.5 * a), -(self.y - (h - r)));
        ctx.beginPath();
        ctx.moveTo(self.x, self.y);
        ctx.lineTo(self.x + a, self.y);
        ctx.lineTo(self.x + 0.5 * a, self.y - h);
        ctx.lineTo(self.x, self.y);
        ctx.stroke();
        ctx.restore()
    }

    self.start = function (direction, repeat) {
        switch (direction) {
            case KEY_MAP.UP: {
                self.state.moving = true;
                if (!repeat) {
                    self.vAngle = self.angle + (Math.PI / 2);
                    stepY = Math.sin(self.vAngle) * step;
                    stepX = Math.cos(self.vAngle) * step
                }
                break;
            }
            case KEY_MAP.LEFT: {
                self.state.rotatingCounterClockWise = true;
                break;
            }
            case KEY_MAP.RIGHT: {
                self.state.rotatingClockWise = true;
                break;
            }
        }
    }


    self.stop = function (direction) {
        switch (direction) {
            case KEY_MAP.UP: {
                //self.state.moving = false;
                break;
            }
            case KEY_MAP.LEFT: {
                self.state.rotatingCounterClockWise = false;
                break;
            }
            case KEY_MAP.RIGHT: {
                self.state.rotatingClockWise = false;
                break;
            }
        }
    }

    self.updateCoords = function () {
        if (self.state.rotatingClockWise) {
            rotateClockWise()
        }
        if (self.state.rotatingCounterClockWise) {
            rotateCounterClockWise();
        }
        if (self.state.moving) {
            move();
        }
    }

    rotateClockWise = function () {
        self.angle += (Math.PI / 180) * 5;
    }

    rotateCounterClockWise = function () {
        self.angle -= (Math.PI / 180) * 5;
    }


    move = function () {
        self.y -= stepY;
        self.x -= stepX
    }
}

const KEY_MAP = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    x: 88,
    c: 67
} 
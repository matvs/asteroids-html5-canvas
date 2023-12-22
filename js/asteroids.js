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
        for(let bullet of this.spaceShip.bullets){
            bullet.draw();
        }
        this.requestId = requestAnimationFrame(this.draw)
    },

    onKeyDownHandler: function (e) {
        e.preventDefault();
        this.spaceShip.handleKeyDown(e.keyCode, e.repeat);
    },

    onKeyUpHandler: function (e) {
        e.preventDefault();
        this.spaceShip.handleKeyUp(e.keyCode);
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

    self.bullets = [];

    self.x = x || 0;
    self.y = y || 0;
    self.angle = 0;
    self.vAngle = (Math.PI / 2);

    self.lastShooted = 0;
    var step = 2;
    var stepX = stepY = 0;
    var a = 10;
    var h = 20;

    var vectorX = 0;
    var vectorY = 0;
    self.draw = function () {
        self.update();
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
        /*ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc((self.x + 0.5 * a), (self.y - h) , 2, 0, 2*Math.PI)
        ctx.fill();
        ctx.restore()*/
        /*ctx.save();
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc((self.x + 0.5 * a) * Math.sin(self.angle), (self.y - h) *Math.cos(self.angle), 2, 0, 2*Math.PI)
        ctx.fill();*/
        //comment restore out in order to see some crazy shit
        ctx.restore()
  
    }

    self.handleKeyDown = function (direction, repeat) {
        switch (direction) {
            case KEY_MAP.UP: {
                self.state.moving = true;
                self.state.accelarating = true;
                
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
            case KEY_MAP.SPACE:
            case KEY_MAP.DOWN: {
                self.state.shooting = true;
                break;
            }
        }
    }


    self.handleKeyUp = function (direction) {
        switch (direction) {
            case KEY_MAP.UP: {
                //self.state.moving = false;
                self.state.accelarating = false;
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
            case KEY_MAP.SPACE:
            case KEY_MAP.DOWN: {
                self.state.shooting = false;
                break;
            }
        }
    }

    self.update = function () {
        if (self.state.rotatingClockWise) {
            rotateClockWise()
        }
        if (self.state.rotatingCounterClockWise) {
            rotateCounterClockWise();
        }
        if (self.state.moving) {
            move();
        }
        if(self.state.shooting && new Date().getTime() - self.lastShooted >= 500){
            self.shoot();
        }
        if(self.state.accelarating){
            self.vAngle = self.angle + (Math.PI / 2);
            vectorX += Math.cos(self.vAngle) * step
            vectorY += Math.sin(self.vAngle) * step;
            let vector = vectorX*vectorX + vectorY*vectorY;
           // if( vector > step){
             if(Math.abs(vectorX) > step || Math.abs(vectorY) > step){   
              
                vectorY = step * ((vectorY)/vector);
                vectorX = step *  ((vectorX/vector));
            }
        
            //self.log();
            //console.log("ANGLE IS " + Math.asin(vectorY/vector)* 180 / Math.PI);
            stepX = vectorX;
            stepY = vectorY;
        }
    }
    
    self.shoot = function(){
        //self.x + 0.5 * a, self.y - h
        let bullet = new Bullet(self.ctx, {
            x : self.x,
            y: self.y,
            a: a,
            h: h
        }, self.angle -  (Math.PI/2))
        self.bullets.push(bullet);
        self.lastShooted = new Date().getTime();
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
        if(self.y < 0){
            self.y = 600;
        }
        if(self.y > 600){
            self.y = 0;
        }
        if(self.x < 0){
            self.x = 600;
        }
        if(self.x > 600){
            self.x = 0;
        }
    }

    self.log = function(){
        console.log("Spaceship logs: " + new Date());
        console.log("x: " + self.x);
        console.log("y: " + self.y);
        console.log("angle (deg): " + self.angle * 180 / Math.PI);
        console.log("vAngle (deg): " + self.vAngle * 180 / Math.PI);
        console.log("---------------------------------------------");
    }
}

function Bullet(ctx, coords, angle){
    var self = this;
    
    var x = coords.x;
    var y = coords.y;
    var a = coords.a;
    var h = coords.h;

    var size = {
        width: 2,
        height: 6
    }

    self.ctx = ctx;
    self.x = x +  0.5*a + 0.5*a * Math.sin(angle + Math.PI/2)// - size.width/2; // + Math.PI/6
    self.y = y - 0.5*h - 0.5*h * Math.cos(angle + Math.PI/2);
    /*self.x = x +  0.5*a + 0.5*a * Math.sin(angle + Math.PI/2); // + Math.PI/6
    self.y = y  + h * Math.cos(angle + Math.PI/2);*/
   /* self.x = (x - size.width/2) * Math.sin(self.angle);
    self.y = y * Math.cos(self.angle);*/
    self.angle = angle;
    
    var startX = x + 0.5 * a;
    var startY = y - h;
    
    var step = 8;
    var stepY = Math.sin(self.angle) * step;
    var stepX = Math.cos(self.angle) * step
    self.state = {
        moving: true
    }

    
    self.draw = function(){
        self.updateCoords();
        self.ctx.save();
        /* let r = (1.0 / 8.0) * (a * a / h) + 0.5 * h;
        ctx.translate(self.x + 0.5 * a, self.y - (h - r));
        ctx.rotate(self.angle - Math.PI/2);
        ctx.translate(-(self.x + 0.5 * a), -(self.y - (h - r)));*/

       self.ctx.translate(self.x + size.width/2, self.y + size.height/2);
        self.ctx.rotate(self.angle - Math.PI/2);
        self.ctx.translate(-(self.x + size.width/2), -(self.y + size.height/2));
        /*self.ctx.beginPath();
        self.ctx.moveTo(self.x, self.y);
        self.ctx.lineTo(self.x + size.width, self.y);
        self.ctx.lineTo(self.x + size.width, self.y  + size.height);
        self.ctx.lineTo(self.x, self.y  + size.height);
        self.ctx.lineTo(self.x, self.y);
        self.ctx.fill();*/
        self.ctx.fillRect(self.x , self.y , size.width, size.height);
        
       // self.ctx.translate(-(self.x + size.width/2), -(self.y + self.height/2));
        //self.ctx.fillRect(self.x, self.y, size.width, size.height);
        //self.ctx.fillRect(-size.width/2, -size.height/2, size.width, size.height);
       /* self.ctx.save();
        self.ctx.fillStyle = "#0000ff";
        self.ctx.beginPath();
        self.ctx.arc((x), (y) , 2, 0, 2*Math.PI)
        self.ctx.fill();
        self.ctx.restore();*/

     
        self.ctx.restore()
        
       /* 
        self.ctx.save();
        self.ctx.fillStyle = "#0000ff";
        self.ctx.beginPath();
        self.ctx.arc((startX), (startY) , 2, 0, 2*Math.PI)
        self.ctx.fill();
        self.ctx.restore();*/
     
    }

    self.updateCoords = function(){
        if(self.state.moving){
            self.x += stepX;
            self.y += stepY;
        }
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
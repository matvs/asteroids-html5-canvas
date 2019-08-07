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

    init: function(){
        this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
        this.onKeyUpHandler = this.onKeyUpHandler.bind(this);

        return this;
    },

    start: function(optionsArg = {}){
        this.options = Object.assign(this.defaultOptions, optionsArg);
        
        this.removeKeyEvents();
        cancelAnimationFrame(this.requestId);

        this.canvas = document.getElementById(this.options.canvasId);
        if(!this.canvas || this.canvas.nodeName != "CANVAS"){
            throw "No canvas found or found element is not canvas"
        }
        
        this.draw = this.draw.bind(this);

        this.ctx = this.canvas.getContext('2d');
        this.spaceShip = new SpaceShip(this.ctx);

        this.requestId = requestAnimationFrame(this.draw)

        this.bindKeyEvents()
    },

    draw: function(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.spaceShip.draw()
        this.requestId = requestAnimationFrame(this.draw)
    },

    onKeyDownHandler: function(e){
        e.preventDefault();
        this.spaceShip.move(e.keyCode);
    },
    
    onKeyUpHandler: function(e){
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


function SpaceShip(ctx){
    var self = this;

    self.ctx = ctx;

    self.state = {

    }
    
    self.x = 0;
    self.y = 0;
    self.angle = 0;

    var a = 10;
    var h = 20;
    self.draw = function(){
        self.updateCoords();
        let ctx = self.ctx;
        ctx.save();
        let r = (1.0/8.0)*(a*a/h) + 0.5*h;
        ctx.translate(self.x + 0.5 * a, self.y - (h-r));
        ctx.rotate(self.angle);
        ctx.translate(-(self.x + 0.5 * a), -(self.y - (h-r)));
        ctx.beginPath();
        ctx.moveTo(self.x, self.y);
        ctx.lineTo(self.x + a, self.y);
        ctx.lineTo(self.x + 0.5 * a, self.y - h);
        ctx.lineTo(self.x, self.y);
        ctx.stroke();
        ctx.restore()
    },

    self.move = function(direction){
       switch(direction){
           case KEY_MAP.UP:{
            self.state.goingUp = true;
            break;
           }
           case KEY_MAP.DOWN:{
            self.state.goingDown = true;
            break;
           }
           case KEY_MAP.LEFT:{
            self.state.goingLeft = true;
            break;
           }
           case KEY_MAP.RIGHT:{
            self.state.goingRight = true;
            break;
           }
           case KEY_MAP.c:{
            self.state.rotatingClockWise = true;
            break;
           }
           case KEY_MAP.x:{
            self.state.rotatingCounterClockWise = true;
            break;
           }
       }
    }


    self.stop = function(direction){
        switch(direction){
            case KEY_MAP.UP:{
             self.state.goingUp = false;
             break;
            }
            case KEY_MAP.DOWN:{
             self.state.goingDown = false;
             break;
            }
            case KEY_MAP.LEFT:{
             self.state.goingLeft = false;
             break;
            }
            case KEY_MAP.RIGHT:{
             self.state.goingRight = false;
             break;
            }
            case KEY_MAP.c:{
             self.state.rotatingClockWise = false;
             break;
            }
            case KEY_MAP.x:{
             self.state.rotatingCounterClockWise = false;
             break;
            }
        }
     }

    self.updateCoords=function(){
        if(self.state.goingUp){
            moveUp();
        }
        if(self.state.goingDown){
            moveDown()
        }
        if(self.state.goingLeft){
            moveLeft()
        }
        if(self.state.goingRight){
            moveRight()
        }
        if(self.state.rotatingClockWise){
            rotateClockWise()
        }
        if(self.state.rotatingCounterClockWise){
            rotateCounterClockWise();
        }
    }

    rotateClockWise = function(){
        self.angle += (Math.PI / 180) * 5;
    }

    rotateCounterClockWise = function(){
        self.angle -= (Math.PI / 180) * 5;
    }

    var step = 10;
    moveUp = function(){
        self.y -= step;
    }

    moveDown = function(){
        self.y += step;
    }

    moveLeft = function(){
        self.x -= step;
    }

    moveRight = function(){
        self.x += step;
    }
}

const KEY_MAP = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    x:88,
    c:67
} 
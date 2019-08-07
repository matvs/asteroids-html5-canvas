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
    
    self.x = 0;
    self.y = 0;

    self.draw = function(){
        self.ctx.fillRect(self.x, self.y, 6, 6);
    },

    self.move = function(direction){
       switch(direction){
           case KEY_MAP.UP:{
            moveUp();
            break;
           }
           case KEY_MAP.DOWN:{
            moveDown();
            break;
           }
           case KEY_MAP.LEFT:{
            moveLeft();
            break;
           }
           case KEY_MAP.RIGHT:{
            moveRight();
            break;
           }
       }
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
    SPACE: 32
} 
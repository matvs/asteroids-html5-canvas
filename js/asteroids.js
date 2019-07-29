var AsteroidsGame = {
    canvas: null,
    ctx: null,
    options: {},
    intervalId: null,
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
        clearInterval(this.intervalId)

        this.canvas = document.getElementById(this.options.canvasId);
        if(!this.canvas || this.canvas.nodeName != "CANVAS"){
            throw "No canvas found or found element is not canvas"
        }
        
        this.draw = this.draw.bind(this);

        this.ctx = this.canvas.getContext('2d');
        this.spaceShip = new SpaceShip(this.ctx);

        //TODO: Probably should be changed to requestAnimationFrame
        setInterval(this.draw, 1000/this.options.fps);

        this.bindKeyEvents()
    },

    draw: function(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.spaceShip.draw()
    },

    onKeyDownHandler: function(e){
        switch(e.keyCode){
            case KEY_MAP.SPACE: {
                e.preventDefault();
                this.spaceShip.move()
                break;
            }
        }
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
        self.ctx.fillRect(self.x, self.y, 15, 15);
    },

    self.move = function(){
        self.x = Math.floor(Math.random()*200);
        self.y = Math.ceil(Math.random()*200);
    }
}

const KEY_MAP = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32
} 
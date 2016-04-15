var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * @module scenes
 */
var scenes;
(function (scenes) {
    /**
     * This class instantiates the game over scene object
     *
     * @class Over
     * @extends scenes.Scene
     */
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        /**
         * Empty Contructor
         *
         * @constructor
         */
        function GameOver() {
            _super.call(this);
            this._initialize();
            this.start();
        }
        /**
         * Sets up a reference to the canvas HTML Element
         *
         * @method _setupCanvas
         * @return void
         */
        GameOver.prototype._setupCanvas = function () {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.style.backgroundColor = "#ffffff";
            canvas.style.opacity = "0.8";
            canvas.style.position = "absolute";
        };
        /**
         * This method sets up default values for class member variables
         * and objects
         *
         * @method _initialize
         * @return void
         */
        GameOver.prototype._initialize = function () {
            // Create to HTMLElements
            this._blocker = document.getElementById("blocker");
            this._blocker.style.display = "none";
            // setup canvas for menu scene
            this._setupCanvas();
            // setup a stage on the canvas
            this._stage = new createjs.Stage(canvas);
            this._stage.enableMouseOver(20);
        };
        /**
         * Add a spotLight to the scene
         *
         * @method addSpotLight
         * @return void
         */
        GameOver.prototype.addSpotLight = function () {
            // Spot Light
            this.spotLight = new SpotLight(0xffffff);
            this.spotLight.position.set(20, 40, -15);
            this.spotLight.castShadow = true;
            this.spotLight.intensity = 2;
            this.spotLight.lookAt(new Vector3(0, 0, 0));
            this.spotLight.shadowCameraNear = 2;
            this.spotLight.shadowCameraFar = 200;
            this.spotLight.shadowCameraLeft = -5;
            this.spotLight.shadowCameraRight = 5;
            this.spotLight.shadowCameraTop = 5;
            this.spotLight.shadowCameraBottom = -5;
            this.spotLight.shadowMapWidth = 2048;
            this.spotLight.shadowMapHeight = 2048;
            this.spotLight.shadowDarkness = 0.5;
            this.spotLight.name = "Spot Light";
            this.add(this.spotLight);
            console.log("Added spotLight to scene");
        };
        /**
         * Add a ground plane to the scene
         *
         * @method addGround
         * @return void
         */
        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++
        /**
         * The start method is the main method for the scene class
         *
         * @method start
         * @return void
         */
        GameOver.prototype.start = function () {
            // Scene changes for Physijs
            this.name = "Game Over Scene";
            this.fog = new THREE.Fog(0xffffff, 0, 750);
            this.setGravity(new THREE.Vector3(0, -10, 0));
            var self = this;
            this._gameOverLabel = new createjs.Text("GAME OVER", "80px Consolas", "#000000");
            this._gameOverLabel.regX = this._gameOverLabel.getMeasuredWidth() * 0.5;
            this._gameOverLabel.regY = this._gameOverLabel.getMeasuredLineHeight() * 0.5;
            this._gameOverLabel.x = config.Screen.WIDTH * 0.5;
            this._gameOverLabel.y = (config.Screen.HEIGHT * 0.5) - 100;
            this._stage.addChild(this._gameOverLabel);
            this._gameoverBackground = new createjs.Bitmap(assets.getResult("gameover"));
            this._gameoverBackground.regX = this._gameoverBackground.getBounds().width * 0.5;
            this._gameoverBackground.regY = this._gameoverBackground.getBounds().height * 0.5;
            this._gameoverBackground.x = config.Screen.WIDTH * 0.5;
            this._gameoverBackground.y = config.Screen.HEIGHT * 0.5;
            this._stage.addChild(this._gameoverBackground);
            this._restartButton = new createjs.Bitmap(assets.getResult("mainmenu"));
            this._restartButton.regX = this._restartButton.getBounds().width * 0.5;
            this._restartButton.regY = this._restartButton.getBounds().height * 0.5;
            this._restartButton.x = config.Screen.WIDTH * 0.5;
            this._restartButton.y = (config.Screen.HEIGHT * 0.5) + 150;
            this._stage.addChild(this._restartButton);
            this._restartButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._restartButton.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._restartButton.on("click", function (event) {
                currentScene = config.Scene.MENU;
                changeScene();
            });
            // Add Spot Light to the scene
            this.addSpotLight();
            camera.position.set(0, 10, -20);
            camera.lookAt(new Vector3(0, 0, 0));
        };
        /**
         * The update method updates the animation loop and other objects
         *
         * @method update
         * @return void
         */
        GameOver.prototype.update = function () {
            this._stage.update();
            this.simulate();
        };
        /**
         * The resize method is a procedure that sets variables and objects on screen resize
         *
         * @method resize
         * @return void
         */
        GameOver.prototype.resize = function () {
            this._setupCanvas();
        };
        return GameOver;
    }(scenes.Scene));
    scenes.GameOver = GameOver;
})(scenes || (scenes = {}));

//# sourceMappingURL=gameOver.js.map

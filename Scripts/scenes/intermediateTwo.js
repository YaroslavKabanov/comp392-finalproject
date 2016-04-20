var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var scenes;
(function (scenes) {
    /**
   * The Scenes module is a namespace to reference all scene objects
   *
   * @module scenes
   */
    //*********************************************************************
    //Source file: intermadiateTwo.ts                                     *
    //Authors names:Yaroslav Kabanov                                      *
    //              Kateryna Bilokhvost                                   *
    //              Milan Verma                                           *
    //Initial commit: March 10, 2016                                      *
    //Last modified by: Kateryna Bilokhvost                               *
    //Last date modified: March 24, 2016                                  *
    //Commit history: GitHub Link:https://github.com/YaroslavKabanov/     *
    //comp392-finalproject/                                               *
    //Program description: This is the basic Three.js based first         *
    //person perspective game which is challenging player to escape       *
    //the mysterious maze with numerous traps before the time             *
    // elapses. Bonus items are hidden in the maze for extra time.        *
    //*********************************************************************
    var IntermediateTwo = (function (_super) {
        __extends(IntermediateTwo, _super);
        /**
         * @constructor
         */
        function IntermediateTwo() {
            _super.call(this);
            this._initialize();
            this.start();
        }
        IntermediateTwo.prototype._setupCanvas = function () {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.style.backgroundColor = "#f7f0e7";
        };
        IntermediateTwo.prototype._initialize = function () {
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
         * The start method is the main method for the scene class
         *
         * @method start
         * @return void
         */
        IntermediateTwo.prototype.start = function () {
            //Instruction Images
            this._instruction = new createjs.Bitmap(assets.getResult("IntermediateImage2"));
            this._instruction.regX = this._instruction.getBounds().width * 0.5;
            this._instruction.regY = this._instruction.getBounds().height * 0.5;
            this._instruction.x = config.Screen.WIDTH * 0.5;
            this._instruction.y = config.Screen.HEIGHT * 0.5;
            this._stage.addChild(this._instruction);
            //play button
            this._startButton = new createjs.Bitmap(assets.getResult("StartButton"));
            this._startButton.regX = this._startButton.getBounds().width * 0.5;
            this._startButton.regY = this._startButton.getBounds().height * 0.5;
            this._startButton.x = config.Screen.WIDTH * 0.5;
            this._startButton.y = (config.Screen.HEIGHT * 0.5) + 100;
            this._stage.addChild(this._startButton);
            this._startButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._startButton.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._startButton.on("click", function (event) {
                createjs.Sound.stop();
                currentScene = config.Scene.LEVELTHREE;
                changeScene();
            });
        };
        /**
         * The update method updates the animation loop and other objects
         *
         * @method update
         * @return void
         */
        IntermediateTwo.prototype.update = function () {
            this._stage.update();
            this.simulate();
        };
        /**
         * The resize method is a procedure that sets variables and objects on screen resize
         *
         * @method resize
         * @return void
         */
        IntermediateTwo.prototype.resize = function () {
            this._setupCanvas();
        };
        return IntermediateTwo;
    }(scenes.Scene));
    scenes.IntermediateTwo = IntermediateTwo;
})(scenes || (scenes = {}));

//# sourceMappingURL=intermediateTwo.js.map

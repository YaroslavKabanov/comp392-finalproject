/**
 * The Scenes module is a namespace to reference all scene objects
 * 
 * @module scenes
 */
//*********************************************************************
//Source file: instructions.ts                                        *
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
module scenes {
    /**
     * The Rule class is where the main action occurs for the game
     * 
     * @class Rule
     * @param havePointerLock {boolean}
     */
    export class Instructions extends scenes.Scene {
        private _blocker: HTMLElement;
        private _stage: createjs.Stage;
        private _gameLabel: createjs.Text;
        private _instruction: createjs.Bitmap;
        private _backButton: createjs.Bitmap;

        /**
         * Empty Constructor - calls _initialize and start methods
         * 
         * @constructor
         */
        constructor() {
            super();

            this._initialize();
            this.start();
        }

        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++++++

        private _setupCanvas(): void {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.style.backgroundColor = "#f7f0e7";
        }


        /**
         * This method sets up default values for class member variables
         * and objects
         * 
         * @method _initialize
         * @return void
         */
        private _initialize(): void {
            // Create to HTMLElements
            this._blocker = document.getElementById("blocker");
            this._blocker.style.display = "none";

            // setup canvas for rule scene
            this._setupCanvas();
            // setup a stage on the canvas
            this._stage = new createjs.Stage(canvas);
            this._stage.enableMouseOver(20);
        }

        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++++++

        /**
         * The start method is the main method for the scene class
         * 
         * @method start
         * @return void
         */
        public start(): void {
            this._gameLabel = new createjs.Text(
                "GAME INSTRUCTIONS",
                "80px Consolas",
                "#000000");
            this._gameLabel.regX = this._gameLabel.getMeasuredWidth() * 0.5;
            this._gameLabel.regY = this._gameLabel.getMeasuredLineHeight() * 0.5;
            this._gameLabel.x = config.Screen.WIDTH * 0.5;
            this._gameLabel.y = config.Screen.HEIGHT * 0.5-150;
            this._stage.addChild(this._gameLabel);
            
            //Instruction Images
            this._instruction = new createjs.Bitmap(assets.getResult("InstructionImage"));
            this._instruction.regX = this._instruction.getBounds().width * 0.5;
            this._instruction.regY = this._instruction.getBounds().height * 0.5;
            this._instruction.x = config.Screen.WIDTH * 0.5 ;
            this._instruction.y = config.Screen.HEIGHT * 0.5;
            this._stage.addChild(this._instruction);
            
            
            //exit button
            this._backButton = new createjs.Bitmap(assets.getResult("BackButton"));
            this._backButton.regX = this._backButton.getBounds().width * 0.5;
            this._backButton.regY = this._backButton.getBounds().height * 0.5;
            this._backButton.x = (config.Screen.WIDTH * 0.5) + 20;
            this._backButton.y = (config.Screen.HEIGHT * 0.5)+ 375;
            this._stage.addChild(this._backButton);

            this._backButton.on("mouseover", (event: createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });

            this._backButton.on("mouseout", (event: createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });

            this._backButton.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.MENU;
                changeScene();
            });
        }

        /**
         * The update method updates the animation loop and other objects
         * 
         * @method update
         * @return void
         */
        
        public update(): void {
            this._stage.update();
        }

        /**
         * The resize method is a procedure that sets variables and objects on screen resize
         * 
         * @method resize
         * @return void
         */
        
        public resize(): void {
            this._setupCanvas();
        }
    }
}
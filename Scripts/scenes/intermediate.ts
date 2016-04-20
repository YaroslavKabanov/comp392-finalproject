module scenes {
    /**
   * The Scenes module is a namespace to reference all scene objects
   * 
   * @module scenes
   */
  
//*********************************************************************
//Source file: intermadiate.ts                                        *
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
    export class Intermediate extends scenes.Scene {
        private _blocker: HTMLElement;
        private _stage: createjs.Stage;
        private _instruction: createjs.Bitmap;
        private _startButton: createjs.Bitmap;
        private _instructionsButton: createjs.Bitmap;
        private _exitButton: createjs.Bitmap;
        /**
         * @constructor 
         */
        constructor() {
            super();

            this._initialize();
            this.start();
        }
        private _setupCanvas(): void {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.style.backgroundColor = "#f7f0e7";
        }

        private _initialize(): void {
            // Create to HTMLElements
            this._blocker = document.getElementById("blocker");
            this._blocker.style.display = "none";

            // setup canvas for menu scene
            this._setupCanvas();
            // setup a stage on the canvas
            this._stage = new createjs.Stage(canvas);
            this._stage.enableMouseOver(20);
        }

        /**
         * The start method is the main method for the scene class
         * 
         * @method start
         * @return void
         */
        public start(): void {

            //Instruction Images
            this._instruction = new createjs.Bitmap(assets.getResult("IntermediateImage1"));
            this._instruction.regX = this._instruction.getBounds().width * 0.5;
            this._instruction.regY = this._instruction.getBounds().height * 0.5;
            this._instruction.x = config.Screen.WIDTH * 0.5 ;
            this._instruction.y = config.Screen.HEIGHT * 0.5;
            this._stage.addChild(this._instruction);
            
            //play button
            this._startButton = new createjs.Bitmap(assets.getResult("StartButton"));
            this._startButton.regX = this._startButton.getBounds().width * 0.5;
            this._startButton.regY = this._startButton.getBounds().height * 0.5;
            this._startButton.x = config.Screen.WIDTH * 0.5;
            this._startButton.y = (config.Screen.HEIGHT * 0.5) + 100;
            this._stage.addChild(this._startButton);

            this._startButton.on("mouseover", (event: createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });

            this._startButton.on("mouseout", (event: createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });

            this._startButton.on("click", (event: createjs.MouseEvent) => {
                createjs.Sound.stop();
                         
                currentScene = config.Scene.LEVELTWO;
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
                        this.simulate();
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
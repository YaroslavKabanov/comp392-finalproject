/**
 * The Scenes module is a namespace to reference all scene objects
 * 
 * @module scenes
 */
//*********************************************************************
//Source file: levelTwo.ts                                            *
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
     * The Play class is where the main action occurs for the game
     * 
     * @class Play
     * @param havePointerLock {boolean}
     */
    export class LevelTwo extends scenes.Scene {
      /**
 * The Scenes module is a namespace to reference all scene objects
 * 
 * @module scenes
 */
        private havePointerLock: boolean;
        private element: any;

        private blocker: HTMLElement;
        private instructions: HTMLElement;

        private spotLight: SpotLight;

        private ambientLight: AmbientLight;

        private groundGeometry: CubeGeometry;
        private groundPhysicsMaterial: Physijs.Material;
        private groundMaterial: PhongMaterial;
        private ground: Physijs.Mesh;
        private groundTexture: Texture;
        private groundTextureNormal: Texture;

        private playerGeometry: CubeGeometry;
        private playerMaterial: Physijs.Material;
        private player: Physijs.Mesh;
        private keyboardControls: objects.KeyboardControls;
        private mouseControls: objects.MouseControls;
        private isGrounded: boolean;
        
        //Platform Cubes
        private cube1: Physijs.Mesh;
        private cube2: Physijs.Mesh;
        private cube3: Physijs.Mesh;
        private cube4: Physijs.Mesh;
        private cube5: Physijs.Mesh;
        private cube6: Physijs.Mesh;
        private cube7: Physijs.Mesh;
        private cube8: Physijs.Mesh;
        private cube9: Physijs.Mesh;
        private cube10: Physijs.Mesh;
        private cube11: Physijs.Mesh;
        private cube12: Physijs.Mesh;
     
        private currentObject;

        private velocity: Vector3;
        private prevTime: number;
        private clock: Clock;

        private stage: createjs.Stage;
        private scoreLabel: createjs.Text;
        private livesLabel: createjs.Text;
        
        private deathPlaneGeometry: CubeGeometry;
        private deathPlaneMaterial: Physijs.Material;
        private deathPlane: Physijs.Mesh;
        
        // Level Two Platform
        private platform: Physijs.Mesh;
        private platformGeometry: Geometry;
        private platformMaterial: Physijs.Material;
        
        //Time Label
        private timeLabel: createjs.Text;



        private finish: Physijs.Mesh;

        /**
         * @constructor
         */
        constructor() {
            super();

            this._initialize();
            this.start();
        }

        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++

        /**
         * Sets up the initial canvas for the play scene
         * 
         * @method setupCanvas
         * @return void
         */
        private _setupCanvas(): void {
            canvas.setAttribute("width", config.Screen.WIDTH.toString());
            canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
            canvas.style.backgroundColor = "#000000";
            canvas.style.opacity = "0.5";
            canvas.style.position = "absolute";
        }

        /**
         * The initialize method sets up key objects to be used in the scene
         * 
         * @method _initialize
         * @returns void
         */
        private _initialize(): void {
            // initialize score and lives values
            timeValue = 10;
            livesValue = 5;

            console.log("Initialize score and lives values");

            // Create to HTMLElements
            this.blocker = document.getElementById("blocker");
            this.instructions = document.getElementById("instructions");
            this.blocker.style.display = "block";

            // setup canvas for menu scene
            this._setupCanvas();

            this.prevTime = 0;
            this.stage = new createjs.Stage(canvas);
            this.velocity = new Vector3(0, 0, 0);

            // setup a THREE.JS Clock object
            this.clock = new Clock();

            // Instantiate Game Controls
            this.keyboardControls = new objects.KeyboardControls();
            this.mouseControls = new objects.MouseControls();
        }
        /**
         * This method sets up the scoreboard for the scene
         * 
         * @method setupScoreboard
         * @returns void
         */
        private setupScoreboard(): void {
            // Add Lives Label
            this.livesLabel = new createjs.Text(
                "LIVES: " + livesValue,
                "40px Consolas",
                "#ffffff"
            );
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.livesLabel);
            console.log("Added Lives Label to stage");

                   // Add Time Label
        this.timeLabel = new createjs.Text(
            "TIME: " + timeValue.toFixed(3),
            "40px Consolas",
            "#ffffff"
        );
         this.timeLabel.x = config.Screen.WIDTH * 0.8;
         this.timeLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
         this.stage.addChild( this.timeLabel);
        console.log("Added Time Label to stage");

        }

        /**
         * Add a spotLight to the scene
         * 
         * @method addSpotLight
         * @return void
         */
        private addSpotLight(): void {
            // Spot Light
            this.spotLight = new SpotLight(0xffffff);
            this.spotLight.position.set(20, 40, -15);
            this.spotLight.castShadow = true;
            this.spotLight.intensity = 3;
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
        }

        private addAmbientLight(): void {
            this.ambientLight = new THREE.AmbientLight(0x404040);
            this.add(this.ambientLight);
        }

        /**
         * Add a ground plane to the scene
         * 
         * @method addGround
         * @return void
         */
        private addGround(): void {
            this.groundTexture = new THREE.TextureLoader().load('../../Assets/images/whiteGround.jpg');
            this.groundTexture.wrapS = THREE.RepeatWrapping;
            this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.repeat.set(8, 8);

            this.groundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/whiteGroundNormal.png');
            this.groundTextureNormal.wrapS = THREE.RepeatWrapping;
            this.groundTextureNormal.wrapT = THREE.RepeatWrapping;
            this.groundTextureNormal.repeat.set(8, 8);

            this.groundMaterial = new PhongMaterial();
            this.groundMaterial.map = this.groundTexture;
            this.groundMaterial.bumpMap = this.groundTextureNormal;
            this.groundMaterial.bumpScale = 0.2;

            this.groundGeometry = new BoxGeometry(61, 1, 52);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground.receiveShadow = true;
            this.ground.name = "Ground";
            this.add(this.ground);
            console.log("Added Ground to scene");
        }


        private addPlatform(): void {
            
            this.platformGeometry = new Geometry();
            
            var platformLoader = new THREE.JSONLoader().load("../../Assets/imported/level2Object.json", (geometry: THREE.Geometry)=> {
                var phongMaterial = new PhongMaterial({ color: 0xB0171F });
                phongMaterial.emissive = new THREE.Color(0xCD0000);
                
                this.platform = new Physijs.ConvexMesh(geometry, phongMaterial, 0);
                this.platform.position.set(0,25,0);
                this.platform.receiveShadow = true;
                this.platform.castShadow = true;
                this.platform.name = "Platform";
                this.add(this.platform);
            });
            console.log("Added platform to Scene");
        }
        
        //add finish box. when player collides the finish box, he wins and goes to viewPosition
        private addFinish(): void {
            
                
            this.finish = new Physijs.BoxMesh(new BoxGeometry(3, 2, 3), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/finish.jpg') }), 0, 0), 0);
            this.finish.position.set(21,19,3);
            this.finish.receiveShadow = true;
            this.finish.castShadow = true;
            this.finish.name = "Finish";
            this.add(this.finish);
            console.log("Added finish to Scene");
        }
        
        // Adding Platform Cubes
        private addPlatformCube(): void {
            var phongMaterial = new PhongMaterial({ color: 0x50c878 });
                phongMaterial.emissive = new THREE.Color(0x50c878);
                
            this.cube1 = new Physijs.BoxMesh(new BoxGeometry(2, 2, 2), phongMaterial, 0);
            this.cube1.position.set(0, 1, -4.75);
            this.cube1.receiveShadow = true;
            this.cube1.castShadow = true;
            this.cube1.name = "cube";
            this.add(this.cube1);
            console.log("Added cube1 to Scene");
            
            this.cube2 = new Physijs.BoxMesh(new BoxGeometry(2, 2, 2), phongMaterial, 0);
            this.cube2.position.set(2.5, 2.7, -5.4);
            this.cube2.receiveShadow = true;
            this.cube2.castShadow = true;
            this.cube2.name = "cube";
            this.add(this.cube2);
            console.log("Added cube2 to Scene");
            
            this.cube3 = new Physijs.BoxMesh(new BoxGeometry(2, 2, 2), phongMaterial, 0);
            this.cube3.position.set(-0.0345, 6.21, -7.3);
            this.cube3.receiveShadow = true;
            this.cube3.castShadow = true;
            this.cube3.name = "cube";
            this.add(this.cube3);
            console.log("Added cube3 to Scene");
            
            this.cube4 = new Physijs.BoxMesh(new BoxGeometry(3, 4, 3), phongMaterial, 0);
            this.cube4.position.set(-3.32, 8.41, -3.07);
            this.cube4.receiveShadow = true;
            this.cube4.castShadow = true;
            this.cube4.name = "cube";
            this.add(this.cube4);
            console.log("Added cube4 to Scene");
            
            this.cube5 = new Physijs.BoxMesh(new BoxGeometry(4, 2, 2), phongMaterial, 0);
            this.cube5.position.set(-3.32,10,0.38);
            this.cube5.receiveShadow = true;
            this.cube5.castShadow = true;
            this.cube5.name = "cube";
            this.add(this.cube5);
            console.log("Added cube5 to Scene");
            
            this.cube6 = new Physijs.BoxMesh(new BoxGeometry(2, 2, 2), phongMaterial, 0);
            this.cube6.position.set(-3.33, 11.62, 4.06);
            this.cube6.receiveShadow = true;
            this.cube6.castShadow = true;
            this.cube6.name = "cube";
            this.add(this.cube6);
            console.log("Added cube6 to Scene");
        
            this.cube7 = new Physijs.BoxMesh(new BoxGeometry(2, 2, 2), phongMaterial, 0);
            this.cube7.position.set(-2,13,6.7);
            this.cube7.receiveShadow = true;
            this.cube7.castShadow = true;
            this.cube7.name = "cube";
            this.add(this.cube7);
            console.log("Added cube7 to Scene");
            
            this.cube8 = new Physijs.BoxMesh(new BoxGeometry(4, 2, 8), phongMaterial, 0);
            this.cube8.position.set(1.74,14,11);
            this.cube8.receiveShadow = true;
            this.cube8.castShadow = true;
            this.cube8.name = "cube";
            this.add(this.cube8);
            console.log("Added cube8 to Scene");
            
            this.cube9 = new Physijs.BoxMesh(new BoxGeometry(8, 2, 2), phongMaterial, 0);
            this.cube9.position.set(6.67,14.9,3.35);
            this.cube9.receiveShadow = true;
            this.cube9.castShadow = true;
            this.cube9.name = "cube";
            this.add(this.cube9);
            console.log("Added cube9 to Scene");
            
            this.cube10 = new Physijs.BoxMesh(new BoxGeometry(2, 2, 8), phongMaterial, 0);
            this.cube10.position.set(13.8,15.7,1.7);
            this.cube10.receiveShadow = true;
            this.cube10.castShadow = true;
            this.cube10.name = "cube";
            this.add(this.cube10);
            console.log("Added cube10 to Scene");
            
            this.cube11 = new Physijs.BoxMesh(new BoxGeometry(6, 2, 6), phongMaterial, 0);
            this.cube11.position.set(21,18,3);
            this.cube11.receiveShadow = true;
            this.cube11.castShadow = true;
            this.cube11.name = "cube";
            this.add(this.cube11);
            console.log("Added cube11 to Scene");
        
        }

        /**
         * Adds the player controller to the scene
         * 
         * @method addPlayer
         * @return void
         */
        private addPlayer(): void {
            // Player Object
            this.playerGeometry = new BoxGeometry(2, 2, 2);
            this.playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);

            this.player = new Physijs.BoxMesh(this.playerGeometry, this.playerMaterial, 1);
            this.player.position.set(22, 15, -0.33);
            this.player.receiveShadow = true;
            this.player.castShadow = true;
            this.player.name = "Player";
            this.add(this.player);
            console.log("Added Player to Scene");
        }
        
        

        /**
         * Add the death plane to the scene
         * 
         * @method addDeathPlane
         * @return void
         */
        private addDeathPlane(): void {
            this.deathPlaneGeometry = new BoxGeometry(200, 1, 200);
            this.deathPlaneMaterial = Physijs.createMaterial(new MeshBasicMaterial({ color: 0xff0000 }), 0.4, 0.6);
            // make deathPlane invisible during play - comment out next two lines during debugging
            this.deathPlaneMaterial.transparent = true;
            this.deathPlaneMaterial.opacity = 0;

            this.deathPlane = new Physijs.BoxMesh(this.deathPlaneGeometry, this.deathPlaneMaterial, 0);
            this.deathPlane.position.set(0, -10, 0);
            this.deathPlane.name = "DeathPlane";
            this.add(this.deathPlane);
        }

        

        /**
         * Event Handler method for any pointerLockChange events
         * 
         * @method pointerLockChange
         * @return void
         */
        pointerLockChange(event): void {
            if (document.pointerLockElement === this.element) {
                // enable our mouse and keyboard controls
                this.keyboardControls.enabled = true;
                this.mouseControls.enabled = true;
                this.blocker.style.display = 'none';
            } else {
                if (livesValue <= 0||livesValue>100) {
                    this.blocker.style.display = 'none';
                    document.removeEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
                } else {
                    this.blocker.style.display = '-webkit-box';
                    this.blocker.style.display = '-moz-box';
                    this.blocker.style.display = 'box';
                    this.instructions.style.display = '';
                }
                // disable our mouse and keyboard controls
                this.keyboardControls.enabled = false;
                this.mouseControls.enabled = false;
                console.log("PointerLock disabled");
            }
        }

        /**
         * Event handler for PointerLockError
         * 
         * @method pointerLockError
         * @return void
         */
        private pointerLockError(event): void {
            this.instructions.style.display = '';
            console.log("PointerLock Error Detected!!");
        }

        // Check Controls Function

        /**
         * This method updates the player's position based on user input
         * 
         * @method checkControls
         * @return void
         */
        private checkControls(): void {
            if (this.keyboardControls.enabled) {
                this.velocity = new Vector3();

                var time: number = performance.now();
                var delta: number = (time - this.prevTime) / 1000;
                

                if (this.isGrounded) {
                    var direction = new Vector3(0, 0, 0);
                    if (this.keyboardControls.moveForward) {
                        this.velocity.z -= 400.0 * delta;
                    }
                    if (this.keyboardControls.moveLeft) {
                        this.velocity.x -= 400.0 * delta;
                    }
                    if (this.keyboardControls.moveBackward) {
                        this.velocity.z += 400.0 * delta;
                    }
                    if (this.keyboardControls.moveRight) {
                        this.velocity.x += 400.0 * delta;
                    }
                    if (this.keyboardControls.jump) {
                        this.velocity.y += 4000.0 * delta;
<<<<<<< HEAD
                        if (this.player.position.y > 100) {
=======
                        if (this.player.position.y > (4+this.currentObject.position.y)) {
>>>>>>> 3b991f67586cf41b339bc1b9bf71626e524e04f0
                            this.isGrounded = false;
                            this.velocity.y = 0;
                            createjs.Sound.play("jump");
                        }
                    }

                    this.player.setDamping(0.7, 0.1);
                    // Changing player's rotation
                    this.player.setAngularVelocity(new Vector3(0, this.mouseControls.yaw, 0));
                    direction.addVectors(direction, this.velocity);
                    direction.applyQuaternion(this.player.quaternion);
                    if (Math.abs(this.player.getLinearVelocity().x) < 20 && Math.abs(this.player.getLinearVelocity().y) < 10) {
                        this.player.applyCentralForce(direction);
                    }

                    this.cameraLook();

                } // isGrounded ends

                //reset Pitch and Yaw
                this.mouseControls.pitch = 0;
                this.mouseControls.yaw = 0;

                this.prevTime = time;
            } // Controls Enabled ends
            else {
                this.player.setAngularVelocity(new Vector3(0, 0, 0));
            }
        }
        
          private timeUpdate(): void {
        if (timeValue>=1000){
            this.timeLabel.text = "GREAT JOB!!!";        }
        else{ 
        timeValue -= 0.001;
        this.timeLabel.text = "TIME: " + timeValue.toFixed(3);
        if (timeValue <= 0) {
             if (livesValue <= 0) {
                  timeValue = 0;
                   this.timeLabel.text = "TRY AGAIN!";
             }
             else{
            createjs.Sound.play("death");
            livesValue--;
            if (livesValue <= 0) {
                 document.exitPointerLock();
                 currentScene = config.Scene.GAMEOVER;
                changeScene();
                timeValue=0;
                this.livesLabel.text = "YOU LOST!";
                 this.timeLabel.text = "TRY AGAIN!";
                console.log("LOOOOSEEEER!!!");
            }
        
            else {
                timeValue = 10;
                this.timeLabel.text = "TIME: " + timeValue.toFixed(3);
                this.livesLabel.text = "LIVES: " + livesValue;
                this.remove(this.player);
                this.player.position.set(22, 15, -0.33);
                this.add(this.player);
            }

        }
        }
        }
    }


        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++

        /**
         * The start method is the main method for the scene class
         * 
         * @method start
         * @return void
         */
        public start(): void {
            // setup the class context to use within events
            var self = this;
             createjs.Sound.play("background");      
            // Set Up Scoreboard
            this.setupScoreboard();

            //check to see if pointerlock is supported
            this.havePointerLock = 'pointerLockElement' in document ||
                'mozPointerLockElement' in document ||
                'webkitPointerLockElement' in document;

            // Check to see if we have pointerLock
            if (this.havePointerLock) {
                this.element = document.body;

                this.instructions.addEventListener('click', () => {

                    // Ask the user for pointer lock
                    console.log("Requesting PointerLock");

                    this.element.requestPointerLock = this.element.requestPointerLock ||
                        this.element.mozRequestPointerLock ||
                        this.element.webkitRequestPointerLock;

                    this.element.requestPointerLock();
                });

                document.addEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
                document.addEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
                document.addEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
            }

            // Scene changes for Physijs
            this.name = "Play Scene";
            this.fog = new THREE.Fog(0xffffff, 0, 750);
            this.setGravity(new THREE.Vector3(0, -10, 0));

            // Add Spot Light to the scene
            this.addSpotLight();
              this.addAmbientLight();

            // Ground Object
            this.addGround();

            this.addFinish();


            // Add player controller
            this.addPlayer();
            
            // Add custom object imported from blender
            this.addPlatform();
           
           this.addPlatformCube();


            // Add death plane to the scene
            this.addDeathPlane();

            // Collision Check with player
            this.player.addEventListener('collision', function(eventObject) {
                if (eventObject.name === "Ground") {
                    self.isGrounded = true;
<<<<<<< HEAD
                   // createjs.Sound.play("hit");
=======
                    this.currentObject = eventObject;
                    createjs.Sound.play("hit");
>>>>>>> 3b991f67586cf41b339bc1b9bf71626e524e04f0
                }
                
                if (eventObject.name === "cube") {
                self.isGrounded = true;
                this.currentObject = eventObject;
                    createjs.Sound.play("hit");
            }

            if (eventObject.name === "DeathPlane") {
                createjs.Sound.play("enemy");
                livesValue--;
                if (livesValue <= 0) {
                     document.exitPointerLock();
                    console.log("loooser!!!");
                     self.livesLabel.text = "YOU LOST!";
                 self.timeLabel.text = "TRY AGAIN!";
                    timeValue=0;
                      currentScene = config.Scene.GAMEOVER;
                changeScene();
                }
                else {
                    timeValue = 10;
                    self.timeLabel.text = "TIME: " + timeValue.toFixed(3);
                    self.livesLabel.text = "LIVES: " + livesValue;
                    self.remove(self.player);
                    self.player.position.set(22, 15, -0.33);
                    self.add(self.player);

                }

            }
           
            if (eventObject.name === "Finish") {
                timeValue = 1000.001;
                livesValue += 10000;          
                self.timeLabel.text = "Good job";
                self.livesLabel.text = "YOU WON!";
                createjs.Sound.stop();
                createjs.Sound.play("finish");
                //self.remove(self.player);
                //self.player.position.set(-45, 50, 0);
                //self.add(self.player);
                 document.exitPointerLock();
                 currentScene = config.Scene.INTERMEDIATETWO;
                
                changeScene();
                camera.position.set(70, 100, 80);
                camera.lookAt(new Vector3(0, 0, 0));
            }
            
        }.bind(self));
        
        // create parent-child relationship with camera and player
            this.player.add(camera);
            camera.rotation.set(0, 0, 0);
            camera.position.set(0, 1, 0);

            this.simulate();
        }


        /**
         * Camera Look function
         * 
         * @method cameraLook
         * @return void
         */
        private cameraLook(): void {
            var zenith: number = THREE.Math.degToRad(90);
            var nadir: number = THREE.Math.degToRad(-90);

            var cameraPitch: number = camera.rotation.x + this.mouseControls.pitch;

            // Constrain the Camera Pitch
            camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
        }

        /**
         * @method update
         * @returns void
         */
        public update(): void {
                      

            this.checkControls();
        this.timeUpdate();

            this.stage.update();

            if (!this.keyboardControls.paused) {
                this.simulate();
            }
        }

        /**
         * Responds to screen resizes
         * 
         * @method resize
         * @return void
         */
        public resize(): void {
            canvas.style.width = "100%";
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.timeLabel.x = config.Screen.WIDTH * 0.8;
            this.timeLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.update();
        }
    }
}
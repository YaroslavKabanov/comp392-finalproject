/**
 * The Scenes module is a namespace to reference all scene objects
 * 
 * @module scenes
 */
module scenes {
    /**
     * The Play class is where the main action occurs for the game
     * 
     * @class Play
     * @param havePointerLock {boolean}
     */
    export class LevelThree extends scenes.Scene {
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


        private crystals: Physijs.ConcaveMesh[];
        private crystalCount: number;

        private deathPlaneGeometry: CubeGeometry;
        private deathPlaneMaterial: Physijs.Material;
        private deathPlane: Physijs.Mesh;

        private velocity: Vector3;
        private prevTime: number;
        private clock: Clock;

        private stage: createjs.Stage;
        private scoreLabel: createjs.Text;
        private livesLabel: createjs.Text;
        
          //add crystals
        private crystalGeometry: Geometry;
        private crystalMaterial: Physijs.Material;
        private crystal: Physijs.ConvexMesh;
        
            private timeLabel: createjs.Text;

        //add obstacles
        private lavaPaddleOne: Physijs.Mesh;
        private lavaPaddleTwo: Physijs.Mesh;
        private lavaPaddleThree: Physijs.Mesh;
        private holeOne: Physijs.Mesh;
        private holeTwo: Physijs.Mesh;
        private obstacleOne: Physijs.Mesh;
        private obstacleTwo: Physijs.Mesh;
        private obstacleThree: Physijs.Mesh;
        private obstacleFour: Physijs.Mesh;
        private obstacleFive: Physijs.Mesh;
        
        //add bridges
        private bridgeOne: Physijs.Mesh;
        private bridgeTwo: Physijs.Mesh;
        private bridgeThree: Physijs.Mesh;
        private bridgeFour: Physijs.Mesh;
        private bridgeFive: Physijs.Mesh;
        private bridgeSix: Physijs.Mesh;
        private bridgeSeven: Physijs.Mesh;
        private bridgeEight: Physijs.Mesh;

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

            this.crystalCount = 10;
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
            this.groundTexture = new THREE.TextureLoader().load('../../Assets/images/ground.jpg');
            this.groundTexture.wrapS = THREE.RepeatWrapping;
            this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.repeat.set(8, 8);

            this.groundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/ground.png');
            this.groundTextureNormal.wrapS = THREE.RepeatWrapping;
            this.groundTextureNormal.wrapT = THREE.RepeatWrapping;
            this.groundTextureNormal.repeat.set(8, 8);

            this.groundMaterial = new PhongMaterial();
            this.groundMaterial.map = this.groundTexture;
            this.groundMaterial.bumpMap = this.groundTextureNormal;
            this.groundMaterial.bumpScale = 0.2;

            this.groundGeometry = new BoxGeometry(100, 1, 5);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground.receiveShadow = true;
            this.ground.name = "Ground";
            this.add(this.ground);
            console.log("Added Ground to scene");
        }
        
        private addObstacles():void{
            this.lavaPaddleOne = new Physijs.BoxMesh(new BoxGeometry(5, 0.1, 5), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/lava.jpg') }), 0, 0), 0);
            this.lavaPaddleOne.position.set(40.75, 0.5, 0);
            this.lavaPaddleOne.receiveShadow = true;
            this.lavaPaddleOne.castShadow = true;
            this.lavaPaddleOne.name = "DeathPlane";
            this.add(this.lavaPaddleOne);
            console.log("Added  lavaPaddleOne to Scene");
            
             this.holeOne = new Physijs.BoxMesh(new BoxGeometry(3.5, 0.1, 3.5), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/lava.jpg') }), 0, 0), 0);
            this.holeOne.position.set(29.62, 0.5, 0);
            this.holeOne.receiveShadow = true;
            this.holeOne.castShadow = true;
            this.holeOne.name = "DeathPlane";
            this.add(this.holeOne);
            console.log("Added  holeOne to Scene");
            
            this.lavaPaddleTwo = new Physijs.BoxMesh(new BoxGeometry(15, 0.1, 5), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/lava.jpg') }), 0, 0), 0);
            this.lavaPaddleTwo.position.set(18.07, 0.5, 0);
            this.lavaPaddleTwo.receiveShadow = true;
            this.lavaPaddleTwo.castShadow = true;
            this.lavaPaddleTwo.name = "DeathPlane";
            this.add(this.lavaPaddleTwo);
            console.log("Added  lavaPaddleTwo to Scene");
            
            this.lavaPaddleThree = new Physijs.BoxMesh(new BoxGeometry(15, 0.1, 5), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/lava.jpg') }), 0, 0), 0);
            this.lavaPaddleThree.position.set(-22.97, 0.5, 0);
            this.lavaPaddleThree.receiveShadow = true;
            this.lavaPaddleThree.castShadow = true;
            this.lavaPaddleThree.name = "DeathPlane";
            this.add(this.lavaPaddleThree);
            console.log("Added  lavaPaddleThree to Scene");
            
            this.obstacleOne = new Physijs.BoxMesh(new BoxGeometry(2, 5, 1.8), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/lava.jpg') }), 0, 0), 0);
            this.obstacleOne.position.set(3.73, 0.5, -1.45);
            this.obstacleOne.receiveShadow = true;
            this.obstacleOne.castShadow = true;
            this.obstacleOne.name = "DeathPlane";
            this.add(this.obstacleOne);
            console.log("Added  obstacleOne to Scene");
            
            this.obstacleTwo = new Physijs.BoxMesh(new BoxGeometry(5, 5, 1.8), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/lava.jpg') }), 0, 0), 0);
            this.obstacleTwo.position.set(4.39, 0.5, 1.62);
            this.obstacleTwo.receiveShadow = true;
            this.obstacleTwo.castShadow = true;
            this.obstacleTwo.name = "DeathPlane";
            this.add(this.obstacleTwo);
            console.log("Added  obstacleTwo to Scene");
            
            this.obstacleThree = new Physijs.BoxMesh(new BoxGeometry(5, 5, 1.8), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/lava.jpg') }), 0, 0), 0);
            this.obstacleTwo.position.set(-2.88, 0.5, -1.04);
            this.obstacleTwo.receiveShadow = true;
            this.obstacleTwo.castShadow = true;
            this.obstacleTwo.name = "DeathPlane";
            this.add(this.obstacleTwo);
            console.log("Added  obstacleTwo to Scene");
            
            this.obstacleFour = new Physijs.BoxMesh(new BoxGeometry(5, 5, 1.8), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/lava.jpg') }), 0, 0), 0);
            this.obstacleTwo.position.set(-6.57, 0.5, 0.84);
            this.obstacleTwo.receiveShadow = true;
            this.obstacleTwo.castShadow = true;
            this.obstacleTwo.name = "DeathPlane";
            this.add(this.obstacleTwo);
            console.log("Added  obstacleTwo to Scene");
            
            this.obstacleFive = new Physijs.BoxMesh(new BoxGeometry(5, 5, 1.8), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/lava.jpg') }), 0, 0), 0);
            this.obstacleTwo.position.set(-11.4, 0.5, -0.89);
            this.obstacleTwo.receiveShadow = true;
            this.obstacleTwo.castShadow = true;
            this.obstacleTwo.name = "DeathPlane";
            this.add(this.obstacleTwo);
            console.log("Added  obstacleTwo to Scene");
            
            this.holeTwo = new Physijs.BoxMesh(new BoxGeometry(3.5, 0.1, 3.5), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/lava.jpg') }), 0, 0), 0);
            this.holeTwo.position.set(-35.8, 0.5, 0);
            this.holeTwo.receiveShadow = true;
            this.holeTwo.castShadow = true;
            this.holeTwo.name = "DeathPlane";
            this.add(this.holeTwo);
            console.log("Added  holeTwo to Scene");
            
        }
            
            private addBridges():void{
            this.bridgeOne = new Physijs.BoxMesh(new BoxGeometry(5, 1, 1), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.bridgeOne.position.set(40.98, 1, -1.93);
            this.bridgeOne.receiveShadow = true;
            this.bridgeOne.castShadow = true;
            this.bridgeOne.name = "savePlace";
            this.add(this.bridgeOne);
            console.log("Added  bridgeOne to Scene");

            this.bridgeTwo = new Physijs.BoxMesh(new BoxGeometry(4, 1, 6), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.bridgeTwo.position.set(30.52, 2.5, 0);
            this.bridgeTwo.receiveShadow = true;
            this.bridgeTwo.castShadow = true;
            this.bridgeTwo.name = "savePlace";
            this.add(this.bridgeTwo);
            console.log("Added  bridgeTwo to Scene");
            
            this.bridgeThree = new Physijs.BoxMesh(new BoxGeometry(2, 1, 3), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.bridgeThree.position.set(24.33, 2.5, -0.79);
            this.bridgeThree.receiveShadow = true;
            this.bridgeThree.castShadow = true;
            this.bridgeThree.name = "savePlace";
            this.add(this.bridgeThree);
            console.log("Added  bridgeThree to Scene");
            
            this.bridgeFour = new Physijs.BoxMesh(new BoxGeometry(2, 1, 3), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.bridgeFour.position.set(20.33, 1.32, 0.78);
            this.bridgeFour.receiveShadow = true;
            this.bridgeFour.castShadow = true;
            this.bridgeFour.name = "savePlace";
            this.add(this.bridgeFour);
            console.log("Added  bridgeFour to Scene");
            
            
            this.bridgeFive = new Physijs.BoxMesh(new BoxGeometry(2, 1, 3), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.bridgeFive.position.set(15.77, 2.22, -0.79);
            this.bridgeFive.receiveShadow = true;
            this.bridgeFive.castShadow = true;
            this.bridgeFive.name = "savePlace";
            this.add(this.bridgeFive);
            console.log("Added  bridgeFive to Scene");
            
            this.bridgeSix = new Physijs.BoxMesh(new BoxGeometry(2, 1, 3), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.bridgeSix.position.set(11.44, 1.5, 0);
            this.bridgeSix.receiveShadow = true;
            this.bridgeSix.castShadow = true;
            this.bridgeSix.name = "savePlace";
            this.add(this.bridgeSix);
            console.log("Added  bridgeSix to Scene");
           
            this.bridgeSeven = new Physijs.BoxMesh(new BoxGeometry(15, 1, 2), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.bridgeSeven.position.set(-23.02, 1.5, 0);
            this.bridgeSeven.receiveShadow = true;
            this.bridgeSeven.castShadow = true;
            this.bridgeSeven.name = "savePlace";
            this.add(this.bridgeSeven);
            console.log("Added  bridgeSeven to Scene");
            
            this.bridgeEight = new Physijs.BoxMesh(new BoxGeometry(3, 1, 3), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.bridgeEight.position.set(-35.72, 1.5, 0.2);
            this.bridgeEight.receiveShadow = true;
            this.bridgeEight.castShadow = true;
            this.bridgeEight.name = "savePlace";
            this.add(this.bridgeEight);
            console.log("Added  bridgeEight to Scene");
        }
                //add finish box. when player collides the finish box, he wins and goes to viewPosition
        private addFinish(): void {
            this.finish = new Physijs.BoxMesh(new BoxGeometry(3, 2, 3), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/finish.jpg') }), 0, 0), 0);
            this.finish.position.set(-24.8, 1, 7.94);
            this.finish.receiveShadow = true;
            this.finish.castShadow = true;
            this.finish.name = "Finish";
            this.add(this.finish);
            console.log("Added finish to Scene");
        }
        
          /**
         * Adds the player controller to the scene
         * 
         * @method addPlayer
         * @return void
         */
        private addPlayer(): void {
            // Player Object
            this.playerGeometry = new BoxGeometry(2, 4, 2);
            this.playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);

            this.player = new Physijs.BoxMesh(this.playerGeometry, this.playerMaterial, 1);
            this.player.position.set(45, 5, -0.33);
            this.player.receiveShadow = true;
            this.player.castShadow = true;
            this.player.name = "Player";
            this.add(this.player);
            console.log("Added Player to Scene");
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
                if (livesValue <= 0) {
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
                        if (this.player.position.y > 4) {
                            this.isGrounded = false;
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
                scene.remove(this.player);
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
                this.player.position.set(45, 5, -0.33);
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
              this.addObstacles();

            // Ground Object
            this.addGround();

            this.addFinish();
            this.addBridges();
         

            // Add player controller
            this.addPlayer();

     


            // Collision Check with player
            this.player.addEventListener('collision', function(eventObject) {
                if (eventObject.name === "Ground") {
                    self.isGrounded = true;
                    createjs.Sound.play("hit");
                }
               if (eventObject.name === "Crystal") {
                timeValue += 5;
                self.remove(eventObject);
              //  self.setCrystalPosition(eventObject);
                self.timeLabel.text = "TIME: " + timeValue.toFixed(3);
                createjs.Sound.play("crystal");
            }

            if (eventObject.name === "DeathPlane") {
                createjs.Sound.play("enemy");
                livesValue--;
                if (livesValue <= 0) {
                    console.log("loooser!!!");
                     self.livesLabel.text = "YOU LOST!";
                 self.timeLabel.text = "TRY AGAIN!";
                    timeValue=0;
                    self.remove(self.player);
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
                 currentScene = config.Scene.INTERMEDIATE;
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
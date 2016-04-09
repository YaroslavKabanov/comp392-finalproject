var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * The Scenes module is a namespace to reference all scene objects
 *
 * @module scenes
 */
var scenes;
(function (scenes) {
    /**
     * The Play class is where the main action occurs for the game
     *
     * @class Play
     * @param havePointerLock {boolean}
     */
    var New = (function (_super) {
        __extends(New, _super);
        /**
         * @constructor
         */
        function New() {
            _super.call(this);
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
        New.prototype._setupCanvas = function () {
            canvas.setAttribute("width", config.Screen.WIDTH.toString());
            canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
            canvas.style.backgroundColor = "#000000";
            canvas.style.opacity = "0.5";
            canvas.style.position = "absolute";
        };
        /**
         * The initialize method sets up key objects to be used in the scene
         *
         * @method _initialize
         * @returns void
         */
        New.prototype._initialize = function () {
            // initialize score and lives values
            scoreValue = 0;
            livesValue = 5;
            console.log("Initialize score and lives values");
            // Create to HTMLElements
            this.blocker = document.getElementById("blocker");
            this.instructions = document.getElementById("instructions");
            this.blocker.style.display = "block";
            // setup canvas for menu scene
            this._setupCanvas();
            this.coinCount = 10;
            this.prevTime = 0;
            this.stage = new createjs.Stage(canvas);
            this.velocity = new Vector3(0, 0, 0);
            // setup a THREE.JS Clock object
            this.clock = new Clock();
            // Instantiate Game Controls
            this.keyboardControls = new objects.KeyboardControls();
            this.mouseControls = new objects.MouseControls();
        };
        /**
         * This method sets up the scoreboard for the scene
         *
         * @method setupScoreboard
         * @returns void
         */
        New.prototype.setupScoreboard = function () {
            // Add Lives Label
            this.livesLabel = new createjs.Text("LIVES: " + livesValue, "40px Consolas", "#ffffff");
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.livesLabel);
            console.log("Added Lives Label to stage");
            // Add Score Label
            this.scoreLabel = new createjs.Text("SCORE: " + scoreValue, "40px Consolas", "#ffffff");
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.scoreLabel);
            console.log("Added Score Label to stage");
        };
        /**
         * Add a spotLight to the scene
         *
         * @method addSpotLight
         * @return void
         */
        New.prototype.addSpotLight = function () {
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
        New.prototype.addGround = function () {
            this.groundTexture = new THREE.TextureLoader().load('../../Assets/images/GravelCobble.jpg');
            this.groundTexture.wrapS = THREE.RepeatWrapping;
            this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.repeat.set(8, 8);
            this.groundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/GravelCobbleNormal.png');
            this.groundTextureNormal.wrapS = THREE.RepeatWrapping;
            this.groundTextureNormal.wrapT = THREE.RepeatWrapping;
            this.groundTextureNormal.repeat.set(8, 8);
            this.groundMaterial = new PhongMaterial();
            this.groundMaterial.map = this.groundTexture;
            this.groundMaterial.bumpMap = this.groundTextureNormal;
            this.groundMaterial.bumpScale = 0.2;
            this.groundGeometry = new BoxGeometry(32, 1, 32);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground.receiveShadow = true;
            this.ground.name = "Ground";
            this.add(this.ground);
            console.log("Added Ground to scene");
        };
        /**
         * Adds the enemy object to the scene
         *
         * @method addEnemy
         * @return void
         */
        New.prototype.addEnemy = function () {
            // Enemy Object
            this.enemyGeometry = new SphereGeometry(1, 32, 32);
            this.enemyGeometry.scale(1, 1.5, 1);
            this.enemyMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xff2200 }), 0.4, 0);
            this.enemy = new Physijs.SphereMesh(this.enemyGeometry, this.enemyMaterial, 2);
            this.enemy.position.set(0, 60, -10);
            this.enemy.castShadow = true;
            this.enemy.name = "Enemy";
            this.add(this.enemy);
            console.log("Added Enemy to Scene");
        };
        New.prototype.addWall = function () {
            this.wallOne = new Physijs.BoxMesh(new BoxGeometry(51, 10, 1), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallOne.position.set(0.48, 5, 25.51);
            this.wallOne.receiveShadow = true;
            this.wallOne.castShadow = true;
            this.wallOne.name = "wallOne";
            this.add(this.wallOne);
            console.log("Added wallOne to Scene");
            this.wallTwo = new Physijs.BoxMesh(new BoxGeometry(1, 10, 51), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallTwo.position.set(26.56, 5, 0.5);
            this.wallTwo.receiveShadow = true;
            this.wallTwo.castShadow = true;
            this.wallTwo.name = "wallTwo";
            this.add(this.wallTwo);
            console.log("Added wallTwo to Scene");
            this.wallThree = new Physijs.BoxMesh(new BoxGeometry(51, 10, 1), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallThree.position.set(0.3, 5, -24.48);
            this.wallThree.receiveShadow = true;
            this.wallThree.castShadow = true;
            this.wallThree.name = "wallThree";
            this.add(this.wallThree);
            console.log("Added wallThree to Scene");
            this.wallFive = new Physijs.BoxMesh(new BoxGeometry(10, 10, 1), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallFive.position.set(20.8, 5, -10.8);
            this.wallFive.receiveShadow = true;
            this.wallFive.castShadow = true;
            this.wallFive.name = "wallFive";
            this.add(this.wallFive);
            console.log("Added wallFive to Scene");
            this.wallSix = new Physijs.BoxMesh(new BoxGeometry(18, 10, 1), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallSix.position.set(16.56, 5, -3.52);
            this.wallSix.receiveShadow = true;
            this.wallSix.castShadow = true;
            this.wallSix.name = "wallSix";
            this.add(this.wallSix);
            console.log("Added wallSix to Scene");
            this.wallSeven = new Physijs.BoxMesh(new BoxGeometry(1, 10, 15), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallSeven.position.set(8.13, 5, -10.61);
            this.wallSeven.receiveShadow = true;
            this.wallSeven.castShadow = true;
            this.wallSeven.name = "wallSeven";
            this.add(this.wallSeven);
            console.log("Added wallSeven to Scene");
            this.wallEight = new Physijs.BoxMesh(new BoxGeometry(10, 10, 1), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallEight.position.set(12.83, 5, -17.7);
            this.wallEight.receiveShadow = true;
            this.wallEight.castShadow = true;
            this.wallEight.name = "wallEight";
            this.add(this.wallEight);
            console.log("Added wallEight to Scene");
            this.wallNine = new Physijs.BoxMesh(new BoxGeometry(1, 10, 20), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallNine.position.set(9.47, 5, 15.82);
            this.wallNine.receiveShadow = true;
            this.wallNine.castShadow = true;
            this.wallNine.name = "wallNine";
            this.add(this.wallNine);
            console.log("Added wallNine to Scene");
            this.wallTen = new Physijs.BoxMesh(new BoxGeometry(10, 10, 1), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallTen.position.set(4.86, 5, 6.4);
            this.wallTen.receiveShadow = true;
            this.wallTen.castShadow = true;
            this.wallTen.name = "wallTen";
            this.add(this.wallTen);
            console.log("Added wallTen to Scene");
            this.wallEleven = new Physijs.BoxMesh(new BoxGeometry(1, 10, 10), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallEleven.position.set(0.35, 5, 1.89);
            this.wallEleven.receiveShadow = true;
            this.wallEleven.castShadow = true;
            this.wallEleven.name = "wallEleven";
            this.add(this.wallEleven);
            console.log("Added wallEleven to Scene");
            this.wallTwelve = new Physijs.BoxMesh(new BoxGeometry(1, 10, 16), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallTwelve.position.set(0.35, 5, -16.52);
            this.wallTwelve.receiveShadow = true;
            this.wallTwelve.castShadow = true;
            this.wallTwelve.name = "wallTwelve";
            this.add(this.wallTwelve);
            console.log("Added wallTwelve to Scene");
            this.wallThirteen = new Physijs.BoxMesh(new BoxGeometry(10, 10, 1), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallThirteen.position.set(-4.04, 5, 16.5);
            this.wallThirteen.receiveShadow = true;
            this.wallThirteen.castShadow = true;
            this.wallThirteen.name = "wallThirteen";
            this.add(this.wallThirteen);
            console.log("Added wallThirteen to Scene");
            this.wallFourteen = new Physijs.BoxMesh(new BoxGeometry(1, 10, 20), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallFourteen.position.set(-8.83, 5, 6.91);
            this.wallFourteen.receiveShadow = true;
            this.wallFourteen.castShadow = true;
            this.wallFourteen.name = "wallFourteen";
            this.add(this.wallFourteen);
            console.log("Added wallFourteen to Scene");
            this.wallFifteen = new Physijs.BoxMesh(new BoxGeometry(10, 10, 1), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallFifteen.position.set(-4.42, 5, -2.63);
            this.wallFifteen.receiveShadow = true;
            this.wallFifteen.castShadow = true;
            this.wallFifteen.name = "wallFifteen";
            this.add(this.wallFifteen);
            console.log("Added wallFifteen to Scene");
            this.wallSixteen = new Physijs.BoxMesh(new BoxGeometry(1, 10, 8), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallSixteen.position.set(-7.07, 5, -20.41);
            this.wallSixteen.receiveShadow = true;
            this.wallSixteen.castShadow = true;
            this.wallSixteen.name = "wallSixteen";
            this.add(this.wallSixteen);
            console.log("Added wallSixteen to Scene");
            this.wallSeventeen = new Physijs.BoxMesh(new BoxGeometry(12, 10, 1), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallSeventeen.position.set(-11.45, 5, -10.21);
            this.wallSeventeen.receiveShadow = true;
            this.wallSeventeen.castShadow = true;
            this.wallSeventeen.name = "wallSeventeen";
            this.add(this.wallSeventeen);
            console.log("Added wallSeventeen to Scene");
            this.wallEighteen = new Physijs.BoxMesh(new BoxGeometry(1, 10, 45), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallEighteen.position.set(-17.52, 5, 3.24);
            this.wallEighteen.receiveShadow = true;
            this.wallEighteen.castShadow = true;
            this.wallEighteen.name = "wallEighteen";
            this.add(this.wallEighteen);
            console.log("Added wallEighteen to Scene");
            this.wallNineteen = new Physijs.BoxMesh(new BoxGeometry(1, 10, 30), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallNineteen.position.set(-24.65, 5, -9.78);
            this.wallNineteen.receiveShadow = true;
            this.wallNineteen.castShadow = true;
            this.wallNineteen.name = "wallNineteen";
            this.add(this.wallNineteen);
            console.log("Added wallNineteen to Scene");
            this.wallTwenty = new Physijs.BoxMesh(new BoxGeometry(1, 10, 15), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallTwenty.position.set(-24.51, 5, 18.18);
            this.wallTwenty.receiveShadow = true;
            this.wallTwenty.castShadow = true;
            this.wallTwenty.name = "wallTwenty";
            this.add(this.wallTwenty);
            console.log("Added wallTwenty to Scene");
            this.wallTwentyOne = new Physijs.BoxMesh(new BoxGeometry(1, 10, 20), Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture('../Assets/images/forest.jpg') }), 0, 0), 0);
            this.wallTwentyOne.position.set(18.01, 5, 6.67);
            this.wallTwentyOne.receiveShadow = true;
            this.wallTwentyOne.castShadow = true;
            this.wallTwentyOne.name = " wallTwentyOne";
            this.add(this.wallTwentyOne);
            console.log("Added  wallTwentyOne to Scene");
        };
        /**
         * Adds the player controller to the scene
         *
         * @method addPlayer
         * @return void
         */
        New.prototype.addPlayer = function () {
            // Player Object
            this.playerGeometry = new BoxGeometry(2, 4, 2);
            this.playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
            this.player = new Physijs.BoxMesh(this.playerGeometry, this.playerMaterial, 1);
            this.player.position.set(0, 30, 10);
            this.player.receiveShadow = true;
            this.player.castShadow = true;
            this.player.name = "Player";
            this.add(this.player);
            console.log("Added Player to Scene");
        };
        /**
         * Add the death plane to the scene
         *
         * @method addDeathPlane
         * @return void
         */
        New.prototype.addDeathPlane = function () {
            this.deathPlaneGeometry = new BoxGeometry(200, 1, 200);
            this.deathPlaneMaterial = Physijs.createMaterial(new MeshBasicMaterial({ color: 0xff0000 }), 0.4, 0.6);
            // make deathPlane invisible during play - comment out next two lines during debugging
            this.deathPlaneMaterial.transparent = true;
            this.deathPlaneMaterial.opacity = 0;
            this.deathPlane = new Physijs.BoxMesh(this.deathPlaneGeometry, this.deathPlaneMaterial, 0);
            this.deathPlane.position.set(0, -10, 0);
            this.deathPlane.name = "DeathPlane";
            this.add(this.deathPlane);
        };
        /**
         * This method adds a coin to the scene
         *
         * @method addCoinMesh
         * @return void
         */
        New.prototype.addCoinMesh = function () {
            var self = this;
            this.coins = new Array(); // Instantiate a convex mesh array
            var coinLoader = new THREE.JSONLoader().load("../../Assets/imported/coin.json", function (geometry) {
                var phongMaterial = new PhongMaterial({ color: 0xE7AB32 });
                phongMaterial.emissive = new THREE.Color(0xE7AB32);
                var coinMaterial = Physijs.createMaterial((phongMaterial), 0.4, 0.6);
                for (var count = 0; count < self.coinCount; count++) {
                    self.coins[count] = new Physijs.ConvexMesh(geometry, coinMaterial);
                    self.coins[count].receiveShadow = true;
                    self.coins[count].castShadow = true;
                    self.coins[count].name = "Coin";
                    self.setCoinPosition(self.coins[count]);
                    console.log("Added Coin " + count + " to the Scene");
                }
            });
        };
        /**
         * This method randomly sets the coin object's position
         *
         * @method setCoinPosition
         * @return void
         */
        New.prototype.setCoinPosition = function (coin) {
            var randomPointX = Math.floor(Math.random() * 20) - 10;
            var randomPointZ = Math.floor(Math.random() * 20) - 10;
            coin.position.set(randomPointX, 10, randomPointZ);
            this.add(coin);
        };
        /**
         * Event Handler method for any pointerLockChange events
         *
         * @method pointerLockChange
         * @return void
         */
        New.prototype.pointerLockChange = function (event) {
            if (document.pointerLockElement === this.element) {
                // enable our mouse and keyboard controls
                this.keyboardControls.enabled = true;
                this.mouseControls.enabled = true;
                this.blocker.style.display = 'none';
            }
            else {
                if (livesValue <= 0) {
                    this.blocker.style.display = 'none';
                    document.removeEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
                }
                else {
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
        };
        /**
         * Event handler for PointerLockError
         *
         * @method pointerLockError
         * @return void
         */
        New.prototype.pointerLockError = function (event) {
            this.instructions.style.display = '';
            console.log("PointerLock Error Detected!!");
        };
        // Check Controls Function
        /**
         * This method updates the player's position based on user input
         *
         * @method checkControls
         * @return void
         */
        New.prototype.checkControls = function () {
            if (this.keyboardControls.enabled) {
                this.velocity = new Vector3();
                var time = performance.now();
                var delta = (time - this.prevTime) / 1000;
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
        };
        /**
         * Have the enemy look at the player
         *
         * @method enemyLook
         * @remove void
         */
        New.prototype.enemyMoveAndLook = function () {
            this.enemy.lookAt(this.player.position);
            var direction = new Vector3(0, 0, 5);
            direction.applyQuaternion(this.enemy.quaternion);
            this.enemy.applyCentralForce(direction);
        };
        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++
        /**
         * The start method is the main method for the scene class
         *
         * @method start
         * @return void
         */
        New.prototype.start = function () {
            var _this = this;
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
                this.instructions.addEventListener('click', function () {
                    // Ask the user for pointer lock
                    console.log("Requesting PointerLock");
                    _this.element.requestPointerLock = _this.element.requestPointerLock ||
                        _this.element.mozRequestPointerLock ||
                        _this.element.webkitRequestPointerLock;
                    _this.element.requestPointerLock();
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
            // Ground Object
            this.addGround();
            // Add Enemy Object
            this.addEnemy();
            // Add player controller
            this.addPlayer();
            this.addWall();
            // Add custom coin imported from Blender
            this.addCoinMesh();
            // Add death plane to the scene
            this.addDeathPlane();
            // Collision Check with player
            this.player.addEventListener('collision', function (eventObject) {
                if (eventObject.name === "Ground") {
                    self.isGrounded = true;
                    createjs.Sound.play("land");
                }
                if (eventObject.name === "Coin") {
                    createjs.Sound.play("coin");
                    self.remove(eventObject);
                    self.setCoinPosition(eventObject);
                    scoreValue += 100;
                    self.scoreLabel.text = "SCORE: " + scoreValue;
                }
                if (eventObject.name === "DeathPlane") {
                    createjs.Sound.play("hit");
                    livesValue--;
                    if (livesValue <= 0) {
                        // Exit Pointer Lock
                        document.exitPointerLock();
                        self.children = []; // an attempt to clean up
                        self.player.remove(camera);
                        // Play the Game Over Scene
                        currentScene = config.Scene.OVER;
                        changeScene();
                    }
                    else {
                        // otherwise reset my player and update Lives
                        self.livesLabel.text = "LIVES: " + livesValue;
                        self.remove(self.player);
                        self.player.position.set(0, 30, 10);
                        self.player.rotation.set(0, 0, 0);
                        self.add(self.player);
                    }
                }
                if (eventObject.name === "Enemy") {
                    var enemySound = createjs.Sound.play("enemy");
                    enemySound.volume = 0.1;
                }
            }.bind(self));
            // Collision check for DeathPlane
            this.deathPlane.addEventListener('collision', function (otherObject) {
                // if a coin falls off the ground, reset
                if (otherObject.name === "Coin") {
                    this.remove(otherObject);
                    this.setCoinPosition(otherObject);
                }
                // if the enemy falls off the ground, reset
                if (otherObject.name === "Enemy") {
                    self.remove(otherObject);
                    self.enemy.position.set(0, 60, -10);
                    self.add(self.enemy);
                    self.enemy.setLinearVelocity(new Vector3(0, 0, 0));
                    self.enemyMoveAndLook();
                }
            }.bind(self));
            // create parent-child relationship with camera and player
            this.player.add(camera);
            camera.rotation.set(0, 0, 0);
            camera.position.set(0, 1, 0);
            this.simulate();
        };
        /**
         * Camera Look function
         *
         * @method cameraLook
         * @return void
         */
        New.prototype.cameraLook = function () {
            var zenith = THREE.Math.degToRad(90);
            var nadir = THREE.Math.degToRad(-90);
            var cameraPitch = camera.rotation.x + this.mouseControls.pitch;
            // Constrain the Camera Pitch
            camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
        };
        /**
         * @method update
         * @returns void
         */
        New.prototype.update = function () {
            this.coins.forEach(function (coin) {
                coin.setAngularFactor(new Vector3(0, 0, 0));
                coin.setAngularVelocity(new Vector3(0, 1, 0));
            });
            this.checkControls();
            this.enemyMoveAndLook();
            this.stage.update();
            if (!this.keyboardControls.paused) {
                this.simulate();
            }
        };
        /**
         * Responds to screen resizes
         *
         * @method resize
         * @return void
         */
        New.prototype.resize = function () {
            canvas.style.width = "100%";
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.update();
        };
        return New;
    }(scenes.Scene));
    scenes.New = New;
})(scenes || (scenes = {}));

//# sourceMappingURL=new.js.map

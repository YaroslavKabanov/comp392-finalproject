/// <reference path="_reference.ts"/>

// MAIN GAME FILE
//*********************************************************************
//Source file: game.ts                                                *
//Source file: _reference.ts                                          *
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

// THREEJS Aliases
import Scene = Physijs.Scene;
import Renderer = THREE.WebGLRenderer;
import PerspectiveCamera = THREE.PerspectiveCamera;
import BoxGeometry = THREE.BoxGeometry;
import CylinderGeometry = THREE.CylinderGeometry; 
import CubeGeometry = THREE.CubeGeometry;
import PlaneGeometry = THREE.PlaneGeometry;
import SphereGeometry = THREE.SphereGeometry;
import Geometry = THREE.Geometry;
import AxisHelper = THREE.AxisHelper;
import LambertMaterial = THREE.MeshLambertMaterial;
import MeshBasicMaterial = THREE.MeshBasicMaterial;
import LineBasicMaterial = THREE.LineBasicMaterial;
import PhongMaterial = THREE.MeshPhongMaterial;
import Material = THREE.Material;
import Texture = THREE.Texture;
import Line = THREE.Line;
import Mesh = THREE.Mesh;
import Object3D = THREE.Object3D;
import SpotLight = THREE.SpotLight;
import PointLight = THREE.PointLight;
import AmbientLight = THREE.AmbientLight;
import Color = THREE.Color;
import Vector3 = THREE.Vector3;
import Face3 = THREE.Face3;
import CScreen = config.Screen;
import Clock = THREE.Clock;

// Setup a Web Worker for Physijs
Physijs.scripts.worker = "/Scripts/lib/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "/Scripts/lib/Physijs/examples/js/ammo.js";

// Game Variables
var scene: scenes.Scene;
var currentScene: number;
var renderer: Renderer;
var camera: PerspectiveCamera;
var timeValue: number;
var livesValue: number;
var highScoreValue: number = 0;
var scoreValue: number;


var levelOne: scenes.LevelOne;
var levelTwo: scenes.LevelTwo;
var levelThree: scenes.LevelThree;
var menu: scenes.Menu;
var intermediate:scenes.Intermediate;
var intermediateTwo:scenes.IntermediateTwo;
var instructions: scenes.Instructions;
var gameOver: scenes.GameOver;
var gameOverWin: scenes.GameOverWin;
//var over: scenes.Over;

var stats: Stats;
var canvas: HTMLElement;
var assets: createjs.LoadQueue;
var manifest = [
    { id: "hit", src: "../../Assets/audio/hit.mp3" },
    { id: "crystal", src: "../../Assets/audio/crystal.wav" },
    { id: "enemy", src: "../../Assets/audio/enemy.mp3" },
    { id: "background", src: "../../Assets/audio/background.mp3" },
    { id: "finish", src: "../../Assets/audio/finish.mp3" },
    { id: "StartButton", src: "../../Assets/images/StartButton1.png" },
    { id: "InstructionsButton", src: "../../Assets/images/InstructionsButton1.png" },
    { id: "ExitButton", src: "../../Assets/images/ExitButton1.png" },
    { id: "BackButton", src: "../../Assets/images/BackButton.png" },
    { id: "InstructionImage", src: "../../Assets/images/instruction1.png" },
    { id: "IntermediateImage1", src: "../../Assets/images/intermediate1.png" },
    { id: "IntermediateImage2", src: "../../Assets/images/intermediate2.png" },
    { id: "menuBackground", src: "../../Assets/images/maxresdefault1.jpg"},
    { id: "gameover", src: "../../Assets/images/gameover.jpg"},
    { id: "mainmenu", src: "../../Assets/images/mainmenu.png"},
    { id: "win", src: "../../Assets/images/win.png"}
    
];

function preload(): void {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    assets.on("complete", init, this);
    assets.loadManifest(manifest);
}

function setupCanvas(): void {
    canvas = document.getElementById("canvas");
    canvas.setAttribute("width", config.Screen.WIDTH.toString());
    canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
    canvas.style.backgroundColor = "#000000";
}

function init(): void {
    // setup the canvas for the game
    setupCanvas();

    // setup the default renderer
    setupRenderer();

    // setup the camera
    setupCamera();

    // set initial scene
    currentScene = config.Scene.MENU;
    changeScene();

    // Add framerate stats
    addStatsObject();

    document.body.appendChild(renderer.domElement);
    gameLoop(); // render the scene	

    // setup the resize event listener
    window.addEventListener('resize', onWindowResize, false);
}

// Window Resize Event Handler
function onWindowResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene.resize();
}

// Add Frame Rate Stats to the Scene
function addStatsObject() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}

// Setup main game loop
function gameLoop(): void {
    stats.update();

    scene.update();

    // render using requestAnimationFrame
    requestAnimationFrame(gameLoop);

    // render the scene
    renderer.render(scene, camera);
}

// Setup default renderer
function setupRenderer(): void {
    renderer = new Renderer({ antialias: true });
    renderer.setClearColor(0x404040, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
    renderer.shadowMap.enabled = true;
    console.log("Finished setting up Renderer...");
}

// Setup main camera for the scene
function setupCamera(): void {
    camera = new PerspectiveCamera(35, config.Screen.RATIO, 0.1, 100);
    //camera.position.set(0, 10, 30);
    //camera.lookAt(new Vector3(0, 0, 0));
    console.log("Finished setting up Camera...");
}

function changeScene(): void {
    // Launch various scenes
    switch (currentScene) {
        case config.Scene.MENU:
            // show the MENU scene
            menu = new scenes.Menu();
            scene = menu;
            console.log("Starting MENU Scene");
            break;

        case config.Scene.LEVELONE:
            //show the PLAY scene
            levelOne = new scenes.LevelOne();
            scene = levelOne;
            console.log("Starting LEVEL ONE Scene");
            break;

        case config.Scene.INTERMEDIATE:
            //show the INTERMEDIATE scene
            intermediate = new scenes.Intermediate();
            scene = intermediate;
            console.log("Starting INTERMEDIATE Scene");
            break;
            
             case config.Scene.INTERMEDIATETWO:
            //show the INTERMEDIATE scene
            intermediateTwo = new scenes.IntermediateTwo();
            scene = intermediateTwo;
            console.log("Starting INTERMEDIATE TWO Scene");
            break;

        case config.Scene.INSTRUCTIONS:
            instructions = new scenes.Instructions();
            scene = instructions;
            console.log("Starting Instruction Scene");
            break;
            
            
        case config.Scene.LEVELTHREE:
            //show the PLAY scene
            levelThree = new scenes.LevelThree();
            scene = levelThree;
            console.log("Starting THREE Scene");
            break;
            
              case config.Scene.GAMEOVER:
            //show the gameOver scene
            gameOver = new scenes.GameOver();
            scene = gameOver;
            console.log("Starting Game Over Scene");
            break;
            
            case config.Scene.GAMEOVERWIN:
            //show the gameOver scene
            gameOverWin = new scenes.GameOverWin();
            scene = gameOverWin;
            console.log("Starting Game Over Win Scene");
            break;
            
            
            case config.Scene.LEVELTWO:
            //show the PLAY scene
            levelTwo = new scenes.LevelTwo();
            scene = levelTwo;
            console.log("Starting Two Scene");
            break;

        //  case config.Scene.OVER:
        // show the game OVER scene           
        //     over = new scenes.Over();
        //     scene = over;
        //     console.log("Starting OVER Scene");           
        //   break;
    }
}

window.onload = preload;

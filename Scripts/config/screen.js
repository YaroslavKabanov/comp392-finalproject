var config;
(function (config) {
    var Screen = (function () {
        function Screen() {
        }
        Screen.WIDTH = window.innerWidth;
        Screen.HEIGHT = window.innerHeight;
        Screen.RATIO = window.innerWidth / window.innerHeight;
        return Screen;
    }());
    config.Screen = Screen;
    // Scene Constants
    var Scene = (function () {
        function Scene() {
        }
        Scene.MENU = 0;
        Scene.LEVELONE = 1;
        Scene.OVER = 2;
        Scene.INSTRUCTIONS = 3;
        Scene.INTERMEDIATE = 4;
        Scene.LEVELTHREE = 5;
        Scene.GAMEOVER = 6;
        Scene.LEVELTWO = 7;
        Scene.GAMEOVERWIN = 8;
        Scene.INTERMEDIATETWO = 9;
        return Scene;
    }());
    config.Scene = Scene;
})(config || (config = {}));

//# sourceMappingURL=screen.js.map

module config {
    export class Screen {
        static WIDTH: number = window.innerWidth;
        static HEIGHT: number = window.innerHeight;
        static RATIO: number = window.innerWidth / window.innerHeight;
    }
    // Scene Constants
    export class Scene {
        public static MENU: number = 0;
        public static LEVELONE: number = 1;
        public static OVER: number = 2;
        public static INSTRUCTIONS: number = 3;
        public static INTERMEDIATE: number = 4;
        public static LEVELTHREE: number = 5;
        public static GAMEOVER: number = 6;
        public static LEVELTWO: number = 7;
        public static GAMEOVERWIN: number=8;
         public static INTERMEDIATETWO: number = 9;
    }
}
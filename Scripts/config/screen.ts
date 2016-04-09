module config {
    export class Screen {
        static WIDTH: number = window.innerWidth;
        static HEIGHT: number = window.innerHeight;
        static RATIO: number = window.innerWidth / window.innerHeight;
    }
    // Scene Constants
    export class Scene {
        public static MENU: number = 0;
        public static NEW: number = 1;
        public static OVER: number = 2;
        public static INSTRUCTIONS: number = 3;
        public static INTERMEDIATE: number = 4;

    }
}
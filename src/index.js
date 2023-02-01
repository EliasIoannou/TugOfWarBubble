
import Phaser from "phaser";
import Preload from "./scenes/Preload";
import Play from "./scenes/Play";

const WIDTH =800;
const HEIGHT = 600;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  
}
const Scenes = [Preload,Play]

const initScenes = ()=> Scenes.map((Scene)=> new Scene(SHARED_CONFIG))

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: 'arcade',
    arcade: {
      //gravity: { y: 200 }
    }
  },
  scene: initScenes()
};


new Phaser.Game(config);

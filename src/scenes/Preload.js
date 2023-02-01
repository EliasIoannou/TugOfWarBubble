import Phaser from "phaser";


class Preload extends Phaser.Scene{

    constructor(){
        super('Preload')
    }

    preload () {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('rope', 'assets/rope.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('groundEdge', 'assets/groundEdge.png');
        this.load.image('rocket', 'assets/Rocket.png');
        this.load.image('girlLetGo', 'assets/girlLetGo.png');
    
        //this.load.image('girl', 'assets/girl.png');

        this.load.spritesheet('girl','assets/girlPulling.png',{
            frameWidth:128,
            frameHeight:128
        });
        this.load.spritesheet('girlLettingGo','assets/girlLetGoAnim.png',{
            frameWidth:128,
            frameHeight:128
        });
        
    }

    create(){
        this.scene.start('Play');
    }

}
export default Preload;
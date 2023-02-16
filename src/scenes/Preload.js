import Phaser from "phaser";


class Preload extends Phaser.Scene{

    constructor(){
        super('Preload')
    }

    preload () {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('rope', 'assets/rope.png');
        
        this.load.image('groundBigger', 'assets/cliff left.png');
        // this.load.image('rocket', 'assets/Rocket.png');
        // this.load.image('girlLetGo', 'assets/girlLetGo.png');
        
        this.load.image('bubble', 'assets/bubble.png');
        this.load.image('bubbleNoArrow', 'assets/bubbleNoArrow.png');
        this.load.svg('bar', 'assets/bar.svg');
        this.load.svg('fill', 'assets/fill.svg');
        this.load.svg('body', 'assets/body.svg');
        
    
        //this.load.image('girl', 'assets/girl.png');

        this.load.spritesheet('girl','assets/girlPulling.png',{
            frameWidth:800,
            frameHeight:600,
            
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
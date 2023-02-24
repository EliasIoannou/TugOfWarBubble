import Phaser from "phaser";


class Preload extends Phaser.Scene{

    constructor(){
        super('Preload')
    }

    preload () {
        this.load.image('sky', 'assets/sky.png');
        
        this.load.image('hint1', 'assets/hint1.png');
        this.load.image('hint2', 'assets/hint2.png');
        this.load.image('groundBigger', 'assets/cliff left.png');
        // this.load.image('rocket', 'assets/Rocket.png');
        // this.load.image('girlLetGo', 'assets/girlLetGo.png');
        
        this.load.image('bubble', 'assets/bubble.png');
        this.load.image('bubbleNoArrow', 'assets/bubbleNoArrow.png');
        this.load.image('bubbleNoArrow2', 'assets/bubbleNoArrow2.png');
        this.load.image('bubbleNoArrow3', 'assets/bubbleNoArrow3.png');
        this.load.svg('bar', 'assets/bar.svg');
        this.load.svg('fill', 'assets/fill.svg');
        this.load.svg('body', 'assets/body.svg');
        this.load.svg('letgo', 'assets/letgo.svg');
        this.load.svg('playButton', 'assets/playHover.svg');
        this.load.svg('playButtonHover', 'assets/play.svg');
        this.load.image('ropeMiddle', 'assets/ropeMiddle.png');
        
    
        //this.load.image('girl', 'assets/girl.png');

        this.load.spritesheet('girl','assets/girlPulling.png',{
            frameWidth:755,
            frameHeight:1080,
            
        });
        this.load.spritesheet('girlEnemy','assets/girlPullingEnemy.png',{
            frameWidth:762,
            frameHeight:1080,

        });
        this.load.spritesheet('rope','assets/rope.png',{
            frameWidth:605,
            frameHeight:430,

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
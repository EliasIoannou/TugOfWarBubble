

export default anims =>{
    anims.create({
        key:'girl-pulling',
        frames: anims.generateFrameNumbers('girl',{start: 0, end: 3}),
        frameRate: 4,
        repeat: -1
    })
    anims.create({
        key:'girl-let-go',
        frames: anims.generateFrameNumbers('girlLettingGo',{start: 0, end: 3}),
        frameRate: 2,
        repeat: 0
    })
}
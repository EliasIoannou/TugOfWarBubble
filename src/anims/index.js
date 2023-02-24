

export default anims =>{
    anims.create({
        key:'girl-pulling',
        frames: anims.generateFrameNumbers('girl',{start: 0, end: 104}),
        frameRate: 24,
        repeat: -1
    })
    anims.create({
        key:'girl-pulling2',
        frames: anims.generateFrameNumbers('girlEnemy',{start: 0, end: 104}),
        frameRate: 24,
        repeat: -1
    })
    anims.create({
        key:'rope-pulling',
        frames: anims.generateFrameNumbers('rope',{start: 0, end: 90}),
        frameRate: 24,
        repeat: -1
    })
    anims.create({
        key:'girl-let-go',
        frames: anims.generateFrameNumbers('girlLettingGo',{start: 0, end: 3}),
        frameRate: 2,
        repeat: 0
    })
}
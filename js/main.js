var txtStyle1 = {
    fill: "#ffffff",
    stroke: "#000000",
    strokeThickness: 10,
    fontFamily: 'font1',
    fontSize: 64,
    align: 'center',
    wordWrap: { width: 720, useAdvancedWrap: true }
};

var txtStyle2 = {
    fill: "#ffffff",
    stroke: "#000000",
    strokeThickness: 20,
    fontFamily: 'font1',
    fontSize: 64,
    align: 'left',
    wordWrap: { width: 720, useAdvancedWrap: true }
};

const bgColorMain = "#0000ff";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 1280,
    backgroundColor: bgColorMain,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: { 
            //gravity: { y: 300 },
            debug: false,
        }
    },
    scene: [Scene1,Scene2,Scene3]
};

//roll dice depending on the faces parameter
//eg.: roll d6 => rollDice(6)
function rollDice(faces,times) {
    if (typeof times == 'undefined') times = 1;
    var x = 0;
    for (var i = 1; i <= times; i++){
        x += Math.floor((Math.random() * faces) + 1);
    }  
    return x;
}

var game = new Phaser.Game(config);
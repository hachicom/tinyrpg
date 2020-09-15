var txtStyleBtn = {
    fill: "#E6AD00",
    stroke: "#503C01",
    strokeThickness: 14,
    fontFamily: 'font1',
    fontSize: 64,
    lineSpacing: 0,
    align: 'center',
    wordWrap: { width: 720, useAdvancedWrap: true }
};

var txtStyle1 = {
    fill: "#ffffff",
    stroke: "#000000",
    strokeThickness: 12,
    fontFamily: 'font1',
    fontSize: 64,
    lineSpacing: 0,
    align: 'center',
    wordWrap: { width: 720, useAdvancedWrap: true }
};

var txtStyle2 = {
    fill: "#ffffff",
    stroke: "#000000",
    strokeThickness: 14,
    fontFamily: 'font1',
    fontSize: 56,
    lineSpacing: -16,
    align: 'left',
    wordWrap: { width: 720, useAdvancedWrap: true }
};

var txtStyle3 = {
    fill: "#000000",
    stroke: "#ffffff",
    strokeThickness: 6,
    fontFamily: 'font1',
    fontSize: 48,
    lineSpacing: 0,
    align: 'right',
    wordWrap: { width: 720, useAdvancedWrap: true }
};

var txtStyle4 = {
    fill: "#ffffff",
    stroke: "#000000",
    strokeThickness: 6,
    fontFamily: 'font1',
    fontSize: 48,
    lineSpacing: 0,
    align: 'right',
    wordWrap: { width: 720, useAdvancedWrap: true }
};

var txtStyle5 = {
    fill: "#ffffff",
    stroke: "#000000",
    strokeThickness: 6,
    fontFamily: 'font1',
    fontSize: 32,
    lineSpacing: 0,
    align: 'right',
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
    scene: [Scene1,Scene2,Scene3,SceneP]
};

/**
 * VARIÁVEIS GLOBAIS
 */
var frameFinalHerois = 15; //aumentar este valor caso altere o spritesheet
var language = 'pt-br'; //en-us

/**
 * FUNÇÕES GLOBAIS
 */

/**
 * Rola o dado definido por faces. Pode ser rolado diversas vezes definindo o parametro times
 * @param {int} faces 
 * @param {int} times 
 */
function rollDice(faces,times) {
    if (typeof times == 'undefined') times = 1;
    var x = 0;
    for (var i = 1; i <= times; i++){
        x += Math.floor((Math.random() * faces) + 1);
    }  
    return x;
}

var game = new Phaser.Game(config);
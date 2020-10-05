class SceneP extends BaseScene {
    constructor(){
        super("pauseGame");
    }

    create(){
        console.log(playerdata);

        this.input.keyboard.on('keyup-SPACE', function (event) {
            this.scene.resume('playGame');
            this.scene.stop();
        }, this);
    }
}
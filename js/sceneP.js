class SceneP extends BaseScene {
    constructor(){
        super("pauseGame");
    }

    create(){
        this.input.keyboard.on('keyup-SPACE', function (event) {
            this.scene.resume('playGame');
            this.scene.stop();
        }, this);
    }
}
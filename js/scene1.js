class Scene1 extends BaseScene {
    constructor(){
        super("bootGame");
    }

    create(){
        this.add.text(20,20, "Loading, please wait...",txtStyle1);
        

        this.fade(false, 1000, 0,0,0, () => {
            this.scene.start("playGame");
        });
    }
}
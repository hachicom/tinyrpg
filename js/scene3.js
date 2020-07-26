class Scene3 extends BaseScene {
    constructor(){
        super("overGame");
    }

    init (){        
        this.fade(true, 1000, 255,255,255, false);
    }

    create(){
        this.add.text(20,20, "Game Over",txtStyle1);
        

        /*this.fade(true, 1000, 0,0,0, () => {
            this.scene.start("playGame");
        });*/
    }
}
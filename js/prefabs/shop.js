class Shop extends Phaser.GameObjects.Group {
    constructor (config) {
        super(config.scene);

        //mantendo referência à cena atual
        this.scene = config.scene;

        //this.setActors(config.player,config.enemy);

        //Elementos gráficos
        this.field = this.create(game.config.width/2 + 120,100,"windowshop").setOrigin(0.5,0);

        //textos
        this.titlelable = this.scene.add.text(this.field.x - 20,this.field.y + 48, "shop",txtStyle1).setOrigin(0.5,0);
        this.add(this.titlelable);
        
        this.txtItem0 = this.scene.add.text(this.field.x + 20,this.field.y + 172, "item 1\nxyz",txtStyle3).setOrigin(0,0);
        this.add(this.txtItem0);
        this.txtPrice0 = this.scene.add.text(this.field.x + 20,this.txtItem0.y + 120, "y$ 100",txtStyle1).setOrigin(0.5,0);
        this.add(this.txtPrice0);

        this.txtItem1 = this.scene.add.text(this.field.x + 20,this.field.y + 432, "item 2\nwkz",txtStyle3).setOrigin(0,0);
        this.add(this.txtItem1);
        this.txtPrice1 = this.scene.add.text(this.field.x + 20,this.txtItem1.y + 120, "y$ 20",txtStyle1).setOrigin(0.5,0);
        this.add(this.txtPrice1);

        
        this.setAllTextVisibility(false);
        
        
        this.fieldween = this.scene.tweens.add({
            targets: this.field,
            y: { from: game.config.height, to: 100 },
            ease: 'Circular',
            duration: 1000,
            repeat: 0,
            paused: true
        });

        this.fieldween.on('complete', function(tween, targets){
            this.setAllTextVisibility(true);
            // this.textween.seek(0);
            // this.textween.play();
            this.scene.shopButtons.setVisible(true); 
        }, this);

        this.fieldweenOut = this.scene.tweens.add({
            targets: this.field,
            y: { from: 100, to: game.config.height},
            ease: 'Bounce',
            duration: 1000,
            repeat: 0,
            paused: true
        });

        this.fieldweenOut.on('complete', function(tween, targets){
            // this.titlelable.setVisible(false);
            this.setVisible(false);
        }, this);

        this.modo = 'criado'; //criado,inicio,jogando,fim
        
        //Adicionando à cena atual
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);

        this.setVisible(false);
    }

    showStore(tipo){
        this.setVisible(true);
        this.field.y = game.config.height;
        this.setAllTextVisibility(false);
        switch(tipo){
            case 'atk': 
                this.titlelable.text = this.scene.txtDB['ATKLABEL'];
                break;
            case 'def': 
                this.titlelable.text = this.scene.txtDB['DEFLABEL'];
                break;
            case 'spd': 
                this.titlelable.text = this.scene.txtDB['SPDLABEL'];
                break;
            case 'item': 
                this.titlelable.text = this.scene.txtDB['ITEMLABEL'];
                break;
        }
        this.fieldween.play();
    }

    hideStore(){
        // this.textween.stop();
        this.titlelable.setVisible(false);
        this.fieldweenOut.play();
    }
    
    setAllTextVisibility(bool){        
        this.titlelable.setVisible(bool);
        this.txtItem0.setVisible(bool);
        this.txtPrice0.setVisible(bool);
        this.txtItem1.setVisible(bool);
        this.txtPrice1.setVisible(bool);
    }
}
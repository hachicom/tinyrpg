class BaseScene extends Phaser.Scene {

    fade (fadeIn, time, r,g,b, callbackFn)  { //TODO: incluir numa scene base e fazer todas as cenas herdar esta base
        if (fadeIn && fadeIn === true) {
            this.cameras.main.on('camerafadeincomplete', () => {
                if (callbackFn) {
                    callbackFn();
                }
            }, this);

            this.cameras.main.fadeIn(time, r,g,b);
        } else {
            this.cameras.main.on('camerafadeoutcomplete', () => {
                if (callbackFn) {
                    callbackFn();
                }
            }, this);

            this.cameras.main.fadeOut(time, r,g,b);
        }
    }
}
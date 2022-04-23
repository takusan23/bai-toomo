/**
 * ゲーム画面（本編）
 * 
 * main.ts が長くならないようにクラスに切り出した。
 */
class GameScene {

    /** 使うアセットのID配列 */
    private static ASSET_IDS = ["end"]

    /** ゲームが流れているシーン */
    scene = new g.Scene({
        game: g.game,
        // このシーンで利用するアセットのIDを列挙し、シーンに通知します
        assetIds: GameScene.ASSET_IDS
    })

    /** フォントの生成 */
    private font = new g.DynamicFont({
        game: g.game,
        fontFamily: "sans-serif",
        size: 48
    })

    /** 時間を表示するラベル */
    private timeLabel = new g.Label({
        scene: this.scene,
        text: "残り時間: 60秒",
        font: this.font,
        fontSize: this.font.size / 2,
        textColor: "black",
        x: 10
    })

    /** コンストラクタ、初期化処理 */
    constructor() {
        this.scene.append(this.timeLabel)
    }

    /**
     * 残り時間を表示する
     * 
     * @param sec 残り時間
     */
    setTimeText = (sec: number) => {
        this.timeLabel.text = `残り時間: ${Math.ceil(sec)}秒`
        this.timeLabel.invalidate()
    }

}

export default GameScene
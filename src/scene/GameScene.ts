import RandomTool from "../tool/RandomTool"
import ToomoManager from "../ToomoManager"

/**
 * ゲーム画面（本編）
 * 
 * main.ts が長くならないようにクラスに切り出した。
 */
class GameScene {

    /** ゲームの幅 */
    private gameWidth = g.game.width

    /** ゲームの高さ */
    private gameHeight = g.game.height

    /** 使うアセットのID配列 */
    private static ASSET_IDS = ToomoManager.ASSET_IDS

    /** ゲームが流れているシーン */
    scene = new g.Scene({
        game: g.game,
        // このシーンで利用するアセットのIDを列挙し、シーンに通知します
        assetIds: GameScene.ASSET_IDS
    })

    /** トーモを生成して管理するクラス */
    private toomoManager = new ToomoManager(this.scene)

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
        // 画像等はロード後に呼び出す
        this.scene.onLoad.add(() => {

            // 画面に追加する
            this.scene.append(this.createBackgroundRect())
            this.scene.append(this.timeLabel)

            // 定期実行。setIntervalもAkashicEngineで用意されてる方を使う。これもニコ生のTSを考慮しているらしい。
            this.scene.setInterval(() => {

                // 遅延させてからトーモを生成する
                this.scene.setTimeout(() => {
                    const toomoSprite = this.toomoManager.generateToomo()
                    this.scene.append(toomoSprite)
                }, RandomTool.getRandom(100, 500))

            }, 500)

        })
        // 毎フレーム呼ばれる
        this.scene.onUpdate.add(() => {
            this.toomoManager.requestUpdate((sprite) => {

            })
        })
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

    /**
     * 背景を作る
     * 
     * @returns 背景
     */
    private createBackgroundRect = () => {
        const backgroundRect = new g.FilledRect({
            scene: this.scene,
            cssColor: "white",
            width: this.gameWidth,
            height: this.gameHeight
        })
        return backgroundRect
    }

}

export default GameScene
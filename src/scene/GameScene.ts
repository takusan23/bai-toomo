import BoxManager from "../BoxManager"
import ToomoManager from "../ToomoManager"
import RandomTool from "../tool/RandomTool"
import BoxData from "../data/BoxData"
import ToomoData from "../data/ToomoData"

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
    private static ASSET_IDS = ToomoManager.ASSET_IDS.concat(BoxManager.ASSET_IDS)

    /** ゲームが流れているシーン */
    scene = new g.Scene({
        game: g.game,
        // このシーンで利用するアセットのIDを列挙し、シーンに通知します
        assetIds: GameScene.ASSET_IDS
    })

    /** トーモを生成して管理するクラス */
    private toomoManager = new ToomoManager(this.scene)

    /** ダンボール箱を管理しておくクラス */
    private boxManager = new BoxManager(this.scene)

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

    /** 点数を表示するラベル */
    private scoreLabel = new g.Label({
        scene: this.scene,
        text: "点数: 0",
        font: this.font,
        fontSize: this.font.size / 2,
        textColor: "black",
        x: 10,
        y: this.timeLabel.height
    })

    /**
     * コンストラクタ、初期化処理
     * 
     * @param onPointReceive 得点加算の際に呼ばれます。
     */
    constructor(onPointReceive: ((addPoint: number) => void)) {
        // 画像等はロード後に呼び出す
        this.scene.onLoad.add(() => {

            // 画面に追加する
            this.scene.append(this.createBackgroundRect())
            this.scene.append(this.timeLabel)
            this.scene.append(this.scoreLabel)
            // ダンボール追加ボタン。コールバック関数はボタン押したとき
            this.scene.append(this.boxManager.createNewBoxButton(() => {
                // 得点に追加する
                // TODO ピッタリのときに最大ポイント
                onPointReceive(this.boxManager.getCurrentBoxData()?.currentPoint ?? 0)
                // 次の箱へ切り替え
                this.scene.append(this.boxManager.nextBox())
            }))
            // 最初のダンボール
            this.scene.append(this.boxManager.nextBox(true))

            // 定期実行。setIntervalもAkashicEngineで用意されてる方を使う。これもニコ生のTSを考慮しているらしい。
            this.scene.setInterval(() => {

                // 遅延させてからトーモを生成する
                this.scene.setTimeout(() => {
                    const toomoSprite = this.toomoManager.generateToomo()
                    this.scene.append(toomoSprite)
                }, RandomTool.getRandom(100, 500))

            }, 500)

        })
        // 毎フレーム呼ぶようにする
        this.scene.onUpdate.add(() => {
            this.toomoManager.requestUpdate((sprite) => {
                // 当たり判定
                const currentBox = this.boxManager.getCurrentBoxSprite()
                if (currentBox !== null && g.Collision.intersectAreas(currentBox, sprite)) {
                    // あたった
                    // ダンボールに詰めていく
                    (currentBox.tag as BoxData).currentPoint += (sprite.tag as ToomoData).point;
                    // トーモを消す
                    (sprite.tag as ToomoData).isActive = false
                    sprite.destroy()
                }
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
     * 今の点数をセットする
     * 
     * @param score 点数
     */
    setScoreText = (score: number) => {
        this.scoreLabel.text = `点数: ${score}`
        this.scoreLabel.invalidate()
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
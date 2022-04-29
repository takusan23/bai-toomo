import BoxManager from "../BoxManager"
import ToomoManager from "../ToomoManager"
import RandomTool from "../tool/RandomTool"
import ToomoData from "../data/ToomoData"
import ProgressBar from "../ProgressBar"

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
    private static ASSET_IDS =
        ToomoManager.ASSET_IDS
            .concat(BoxManager.ASSET_IDS)
            .concat(['rail', 'fill_rail'])

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

    /** プログレスバーを管理するクラス */
    private progressBar = new ProgressBar(this.scene)

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
     * @param onPointReceive 得点加算の際に呼ばれます。
     */
    constructor(onPointReceive: ((addPoint: number) => void)) {
        // 画像等はロード後に呼び出す
        this.scene.onLoad.add(() => {

            // 画面に追加する
            this.scene.append(this.createBackgroundRect())
            this.scene.append(this.createToomoRail())
            this.scene.append(this.createBoxRail())
            this.scene.append(this.timeLabel)
            this.scene.append(this.scoreLabel)
            // ダンボール追加ボタン。コールバック関数はボタン押したとき
            this.scene.append(this.boxManager.createNewBoxButton(() => {
                // 得点に追加して、次の箱へ切り替える
                onPointReceive(this.nextBox())
            }))
            // 最初のダンボール
            this.scene.append(this.boxManager.nextBox(true))

            // プログレスバー、真ん中に設置する
            this.progressBar.setPosition((this.gameWidth - ProgressBar.VIEW_WIDTH) / 2, this.gameHeight - ProgressBar.VIEW_HEIGHT)
            this.progressBar.setProgress(0)
            this.progressBar.addToScene()

            // 定期実行。setIntervalもAkashicEngineで用意されてる方を使う。これもニコ生のTSを考慮しているらしい。
            this.scene.setInterval(() => {
                // トーモを生成する
                this.registerToomoGenerator()
            }, 500)

            // 20秒後に2倍に増やす
            this.scene.setTimeout(() => {
                this.scene.setInterval(() => {
                    this.registerToomoGenerator()
                }, 500)
            }, 20_000)

        })
        // 毎フレーム呼ぶようにする
        this.scene.onUpdate.add(() => {
            this.toomoManager.requestUpdate((sprite) => {
                // 当たり判定
                const currentBox = this.boxManager.getCurrentBoxSprite()
                const currentBoxData = this.boxManager.getCurrentBoxData()
                if (currentBox !== null && currentBoxData !== null && g.Collision.intersectAreas(currentBox, sprite)) {
                    // あたった
                    // ダンボールに詰めていく
                    currentBoxData.currentPoint += (sprite.tag as ToomoData).point;
                    // プログレスバーを再描画する
                    this.progressBar.setMax(currentBoxData.maxPoint);
                    this.progressBar.setProgress(currentBoxData.currentPoint);
                    // トーモを消す
                    (sprite.tag as ToomoData).isActive = false
                    sprite.destroy()
                }
            })
        })
    }

    /**
     * 残り時間を表示する
     * @param sec 残り時間
     */
    setTimeText = (sec: number) => {
        this.timeLabel.text = `残り時間: ${Math.ceil(sec)}秒`
        this.timeLabel.invalidate()
    }

    /**
     * 今の点数をセットする
     * @param score 点数
     */
    setScoreText = (score: number) => {
        this.scoreLabel.text = `点数: ${score}`
        this.scoreLabel.invalidate()
    }

    /**
     * 次のダンボールへ切り替える 
     * @return 加点する点数、問題がある場合は0を返す
     */
    nextBox = (): number => {
        // 得点に追加する
        const currentBoxData = this.boxManager.getCurrentBoxData()
        if (currentBoxData === null) {
            return 0
        }
        // 多すぎた場合と少なすぎた場合は減点になる
        const lostPoint = Math.abs(currentBoxData.maxPoint - currentBoxData.currentPoint)
        const calcPoint = Math.max(0, currentBoxData.maxPoint - lostPoint)
        // 次の箱へ切り替え
        this.scene.append(this.boxManager.nextBox())
        // 点数を返す
        return calcPoint
    }

    /** トーモを定期的に生成する関数 */
    registerToomoGenerator = () => {
        // 遅延させてからトーモを生成する
        this.scene.setTimeout(() => {
            const toomoSprite = this.toomoManager.generateToomo()
            this.scene.append(toomoSprite)
        }, RandomTool.getRandom(100, 500))
    }

    /** 箱詰めしたダンボールの数 */
    getBoxCount = () => this.boxManager.getBoxCount()

    /** 後始末を行う */
    destroy = () => {
        this.scene.onUpdate.removeAll()
    }

    /**
     * 背景を作る
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

    /**
     * トーモを流すレール画像を作成する
     * @returns レールの画像
     */
    private createToomoRail = () => {
        const image = this.scene.asset.getImageById("rail")
        const sprite = new g.Sprite({
            scene: this.scene,
            src: image,
            x: (this.gameWidth - image.width) + 25, // ちょっと食い込ませる
            y: 80
        })
        return sprite
    }

    /**
     * ダンボールを流すレール画像を作成する
     * @returns レールの画像
     */
    private createBoxRail = () => {
        const image = this.scene.asset.getImageById("fill_rail")
        const sprite = new g.Sprite({
            scene: this.scene,
            src: image,
            x: -10, // 画面外へちょっと出す
            y: 200 + 70 // ダンボール画像の高さを足している
        })
        return sprite
    }

}

export default GameScene
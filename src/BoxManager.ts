import BoxData from "./data/BoxData"

/** ダンボールの画像、入ったトーモを管理するクラス */
class BoxManager {

    /** 箱の移動速度 */
    private static readonly SPEED = 30

    /** ゲームの幅 */
    private gameWidth = g.game.width

    /** ゲームの高さ */
    private gameHeight = g.game.height

    /** 使うアセットID */
    static ASSET_IDS = [
        "box",
        "box_finish",
        "new_box"
    ]

    /** Sprite 生成時に使う */
    private scene: g.Scene

    /** 生成したダンボールのSprite */
    private boxList = new Array<g.Sprite>()

    /**
     * コンストラクタ
     * 
     * @param _scene Sprite 生成時に必要です 
     */
    constructor(_scene: g.Scene) {
        this.scene = _scene
    }

    /**
     * 次のダンボールを生成する
     * 
     * @param isSkipAnimation アニメーションを飛ばして真ん中にセットする場合はtrue
     * @return ボタンの画像
     */
    nextBox = (isSkipAnimation: boolean = false, maxPoint: number = 3000): g.Sprite => {
        // 今のダンボールを終わらせる。初回時は動かない
        this.finishCurrentBox()
        // Sprite 作成
        const image = this.scene.asset.getImageById("box")
        const sprite = new g.Sprite({
            scene: this.scene,
            src: image,
            x: this.gameWidth + image.width,
            y: 200
        })
        // tagに入れる
        sprite.tag = this.createBoxData(maxPoint)
        this.boxList.push(sprite)
        // 真ん中へ移動させる
        if (isSkipAnimation) {
            sprite.x = (this.gameWidth - sprite.width) / 2
            sprite.modified()
        } else {
            this.activateCurrentBox()
        }
        return sprite
    }

    /**
     * ダンボール作成ボタンを作って返す
     * 
     * @param onClick 押したときに呼ばれます
     * @return ボタンの画像
     */
    createNewBoxButton = (onClick: () => void): g.Sprite => {
        const image = this.scene.asset.getImageById("new_box")
        const sprite = new g.Sprite({
            scene: this.scene,
            src: image,
            x: this.gameWidth - image.width,
            y: this.gameHeight - image.height - 100
        })
        // なんか onPointDown を true にしないとクリックイベントが取れない罠がある、ドキュメントに書いとけ
        sprite.touchable = true
        sprite.onPointDown.add(onClick)
        return sprite
    }

    /**
     * 現在のダンボールのSpriteを返す、ない場合はnull
     * 
     * "strictNullChecks": true にしてね
     * 
     * @return Sprite
     */
    getCurrentBoxSprite = (): g.Sprite | null => (!this.isEmpty()) ? this.boxList[this.boxList.length - 1] : null

    /**
     * 現在のダンボールの BoxData を返す、ない場合はnull
     * 
     * @return BoxData
     */
    getCurrentBoxData = (): BoxData | null => {
        const sprite = this.getCurrentBoxSprite()
        if (sprite !== null) {
            return sprite.tag as BoxData
        } else {
            return null
        }
    }

    /** ダンボールに箱詰めした件数 */
    getBoxCount = () => this.boxList.length

    /**
     * BoxData を返す
     * 
     * @param maxPoint 最大ポイント
     * @return BoxData
     */
    private createBoxData = (maxPoint: number): BoxData => ({
        currentPoint: 0,
        maxPoint: maxPoint,
        isFinished: false
    })

    /** 今のダンボールを真ん中へ移動させる */
    private activateCurrentBox = () => {
        const boxSprite = this.getCurrentBoxSprite()
        if (boxSprite !== null) {
            const updateFunc = () => {
                const centerXPos = (this.gameWidth - boxSprite.width) / 2
                if (centerXPos < boxSprite.x) {
                    boxSprite.x = Math.max(boxSprite.x - BoxManager.SPEED, centerXPos)
                    boxSprite.modified()
                } else {
                    boxSprite.onUpdate.remove(updateFunc)
                }
            }
            boxSprite.onUpdate.add(updateFunc)
        }
    }

    /** 現在のダンボールを終了させる（次のダンボールにする） */
    private finishCurrentBox = () => {
        const image = this.scene.asset.getImageById("box_finish")
        const boxSprite = this.getCurrentBoxSprite()
        if (boxSprite !== null) {
            // 閉じたアイコンにする、天地無用のシールを貼っておこう。
            (boxSprite.tag as BoxData).isFinished = true
            boxSprite.src = image
            boxSprite.invalidate()

            // 画面外に押しやる
            const updateFunc = () => {
                // 横にズサーッ
                if (0 <= (boxSprite.x + boxSprite.width)) {
                    boxSprite.x -= BoxManager.SPEED
                    boxSprite.modified()
                } else {
                    // 破棄する
                    boxSprite.onUpdate.remove(updateFunc)
                    boxSprite.destroy()
                }
            }
            boxSprite.onUpdate.add(updateFunc)
        }
    }

    /**
     * 配列が空かどうか 
     * 
     * @return 空っぽならtrue
     */
    private isEmpty = () => this.boxList.length === 0
}

export default BoxManager
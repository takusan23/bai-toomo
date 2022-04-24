import ToomoData from "./data/ToomoData"
import RandomTool from "./tool/RandomTool"

/**
 * トーモの画像を表示させて、移動させ、管理するクラス
 * 
 * scene#onLoad の後に呼ぶ必要があります。アセットIDはシーンに予め登録しておいてください。
 */
class ToomoManager {

    /** ゲームの幅 */
    private gameWidth = g.game.width

    /** トーモの画像ID配列。シーンに予め登録しておいてください */
    static ASSET_IDS = [
        "ccc",
        "drink",
        "glass_1",
        "glass_2",
        "intai",
        "kiyomizu",
        "mask",
        "syoumei",
    ]

    /** 出場者一覧、一人何役だよ */
    private static TOOMO_DATA_LIST: Array<ToomoData> = [
        // 過去作から特別出演
        { assetId: "intai", displayName: "引退", point: 200, speed: 10 },
        { assetId: "kiyomizu", displayName: "清水寺", point: 200, speed: 10 },
        // こっから令和2022最新版画像
        { assetId: "ccc", displayName: "ココナッツ", point: 100, speed: 20 },
        { assetId: "drink", displayName: "ごくごく", point: 200, speed: 10 },
        { assetId: "glass_1", displayName: "メガネ", point: 200, speed: 10 },
        { assetId: "glass_2", displayName: "サングラス", point: 200, speed: 10 },
        { assetId: "mask", displayName: "感染症対策", point: 400, speed: 20 },
        { assetId: "syoumei", displayName: "証明写真", point: 400, speed: 20 },
        { assetId: "lemon", displayName: "レモン2", point: 300, speed: 30 },
    ]

    /**
     * 生成したトーモの画像配列 
     *
     * Tag に {@link TOomo} 
     */
    private toomoSpriteList = new Array<g.Sprite>()

    /** Sprite 生成に必要なので */
    private scene: g.Scene

    /**
     * コンストラクタ
     * 
     * @param _scene Sprite 生成時に必要です 
     */
    constructor(_scene: g.Scene) {
        this.scene = _scene
    }

    /**
     * 新しいトーモを生成する。Sprite を返すのでシーンに追加してください。
     * 
     * @param assetId トーモを指定したい場合はどうぞ
     */
    generateToomo = (assetId: string = this.randomId()): g.Sprite => {
        // 情報取得
        const toomoData = this.findToomoDataByAssetId(assetId)
        // Sprite 作成
        const image = this.scene.asset.getImageById(toomoData.assetId)
        const sprite = new g.Sprite({
            scene: this.scene,
            src: image,
            x: this.gameWidth - image.width,
            y: 50 - (image.height / 2)
        })
        // tag にデータを入れておく
        sprite.tag = toomoData
        // 配列に入れて返す
        this.toomoSpriteList.push(sprite)
        return sprite
    }

    /**
     * 生成したトーモを動かす関数、Scene#onUpdateで毎フレーム呼んでください。
     * 
     * @param onEach 各Spriteを動かすので動かした後に呼ばれます
     */
    requestUpdate = (onEach: (sprite: g.Sprite) => void) => {
        this.toomoSpriteList.forEach((sprite) => {
            const toomoData = (sprite.tag as ToomoData)
            // 真ん中を超えたら下に移動する
            if ((sprite.x + (sprite.width / 2)) <= (this.gameWidth / 2)) {
                // 下に移動する
                sprite.y += toomoData.speed
            } else {
                // 横に移動
                sprite.x -= toomoData.speed
            }
            // 再描画
            sprite.modified()
            onEach(sprite)
        })
    }

    /**
     * ToomoCharacterManager.ASSET_IDS からランダムで選ぶ
     * 
     * @returns ランダムで画像のIDを返す
     */
    private randomId = (): string => RandomTool.randomFromArray(ToomoManager.ASSET_IDS)

    /**
     * assetId から ToomoData を探して返す
     * 
     * @param assetId 画像（アセット）ID
     */
    private findToomoDataByAssetId = (assetId: string): ToomoData => ToomoManager.TOOMO_DATA_LIST.filter((data) => data.assetId === assetId)[0]

}

export default ToomoManager
/**
 * 表示させているトーモのデータ。得点とか移動速度とか。
 * SpriteのTagの中に入れます。Sprite#tag でキャストしてアクセス可能です。
 */
type ToomoData = {
    /** 画像のアセットID */
    assetId: string
    /** 画像が何を指しているのか名前 */
    displayName: string
    /** 移動速度 */
    speed: number
    /** 加点する値 */
    point: number
    /** 有効な場合はtrue、もう表示されない場合はfalseになる */
    isActive: boolean
}

export default ToomoData
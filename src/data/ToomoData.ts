/** 表示させているトーモのデータ。得点とか移動速度とか */
type ToomoData = {
    /** 画像のアセットID */
    assetId: string
    /** 画像が何を指しているのか名前 */
    displayName: string
    /** 移動速度 */
    speed: number
    /** 加点する値 */
    point: number
}

export default ToomoData
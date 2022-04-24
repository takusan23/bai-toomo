/** ダンボールのデータ。ダンボール内に入っているポイントなど */
type BoxData = {
    /** 現在のポイント */
    currentPoint: number
    /** 最大値 */
    maxPoint: number
    /** もう蓋を閉じた場合はtrue、天地無用！ */
    isFinished: boolean
}

export default BoxData
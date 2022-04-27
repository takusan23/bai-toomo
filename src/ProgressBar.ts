/**
 * プログレスバーを作る
 */
class ProgressBar {

    /** プログレスバーの高さ */
    static readonly VIEW_HEIGHT = 20

    /** プログレスバーの幅 */
    static readonly VIEW_WIDTH = 200

    /** Sprite生成に使います */
    private scene: g.Scene

    /** プログレスバーの背景色 */
    private VIEW_BACKGROUND_COLOR = "gray"

    /** プログレスバーの全面色 */
    private VIEW_FOREGROUND_COLOR = "deepskyblue"

    /** 現在の値 */
    private progress = 0

    /** 最大値 */
    private max = 100

    /** 背景に描画するRect */
    private backgroundRect: g.FilledRect

    /** 全面に描画するRect */
    private foregroundRect: g.FilledRect

    /**
     * コンストラクタ
     * @param scene Sprite生成に使います
     */
    constructor(scene: g.Scene) {
        this.scene = scene
        // 初期化
        this.backgroundRect = new g.FilledRect({
            scene: this.scene,
            cssColor: this.VIEW_BACKGROUND_COLOR,
            width: ProgressBar.VIEW_WIDTH,
            height: ProgressBar.VIEW_HEIGHT
        })
        this.foregroundRect = new g.FilledRect({
            scene: this.scene,
            cssColor: this.VIEW_FOREGROUND_COLOR,
            width: ProgressBar.VIEW_WIDTH,
            height: ProgressBar.VIEW_HEIGHT
        })
    }

    /** シーンにプログレスバーを追加する、複数Rectなのでappendをこっちで呼んでいる */
    addToScene = () => {
        this.scene.append(this.backgroundRect)
        this.scene.append(this.foregroundRect)
    }

    /**
     * 現在の値を設定する
     * @param progress 進捗
     */
    setProgress = (progress: number) => {
        this.progress = progress
        this.updateState()
    }

    /**
     * 最大値を設定する
     * @param max 最大値
     */
    setMax = (max: number) => {
        this.max = max
        this.updateState()
    }

    /**
     * 表示位置を設定する
     * @param x X 座標
     * @param y Y 座標
     */
    setPosition = (x: number, y: number) => {
        this.backgroundRect.x = x
        this.backgroundRect.y = y
        this.foregroundRect.x = x
        this.foregroundRect.y = y
        // 再描画
        this.backgroundRect.modified()
        this.foregroundRect.modified()
    }

    /** プログレスバーへ値を反映させる */
    private updateState = () => {
        // 進捗に合わせて width を設定する
        const progressWidth = Math.min(ProgressBar.VIEW_WIDTH, (this.progress / this.max) * ProgressBar.VIEW_WIDTH)
        this.foregroundRect.width = progressWidth
        this.foregroundRect.modified()
    }

}

export default ProgressBar
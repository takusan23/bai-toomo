/**
 * 終了画面
 */
class EndScene {

    /** スコアラベルのY座標 */
    private static SCORE_LABEL_Y_POS = 100

    /** フォントの生成 */
    private static font = new g.DynamicFont({
        game: g.game,
        fontFamily: "sans-serif",
        size: 48
    })

    /**
     * 終了画面を作成して返す
     * 
     * @params score 点数
     * @params boxCount ダンボール数
     * @returns 終了画面
     */
    static createEndScene = (score: number, boxCount: number) => {
        const endScene = new g.Scene({
            game: g.game,
            // このシーンで利用するアセットのIDを列挙し、シーンに通知します
            assetIds: ["end"]
        })
        // 読み込んだら
        endScene.onLoad.add(() => {
            const endImage = new g.Sprite({
                scene: endScene,
                src: endScene.asset.getImageById("end"),
            })
            endScene.append(endImage)

            // スコアを表示
            const scoreLabel = EndScene.createLabel(
                endScene,
                g.game.width / 2,
                this.SCORE_LABEL_Y_POS,
                30,
                `点数: ${score}点`
            )
            // ダンボール数
            const boxLabel = EndScene.createLabel(
                endScene,
                g.game.width / 2,
                this.SCORE_LABEL_Y_POS + scoreLabel.height,
                25,
                `ダンボール: ${boxCount}個`
            )
            endScene.append(scoreLabel)
            endScene.append(boxLabel)
        })
        return endScene
    }

    /**
     * Labelを生成する
     * @param scene シーン
     * @param xPos X座標
     * @param yPos Y座標
     * @param fontSize フォントサイズ
     * @param text テキスト
     * @returns Label
     */
    private static createLabel = (scene: g.Scene, xPos: number, yPos: number, fontSize: number, text: string) => new g.Label({
        scene: scene,
        text: text,
        font: this.font,
        fontSize: fontSize,
        textColor: "black",
        x: xPos,
        y: yPos
    })

}

export default EndScene
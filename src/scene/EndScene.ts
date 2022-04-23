/**
 * 終了画面
 */
class EndScene {

    /**
     * 終了画面を作成して返す
     * 
     * @returns 終了画面
     */
    static createEndScene = () => {
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
        })
        return endScene
    }

}

export default EndScene
/**
 * タイトル画面を生成する関数がある
 */
class TitleScene {

    /**
     * タイトル画面を作成して返します
     * 
     * @return タイトル画面
     */
    static createTitleScene = (): g.Scene => {
        const titleScene = new g.Scene({
            game: g.game,
            // このシーンで利用するアセットのIDを列挙し、シーンに通知します
            assetIds: ["title", "sokuzitu_saiyou"]
        })
        // 読み込んだら
        titleScene.onLoad.add(() => {
            // タイトル画像を召喚します
            const titleImage = new g.Sprite({
                scene: titleScene,
                src: titleScene.asset.getImageById("title"),
            })
            titleScene.append(titleImage)

            // 「即日採用」音声を再生
            titleScene.asset.getAudioById("sokuzitu_saiyou").play();
        })
        return titleScene
    }

}

export default TitleScene
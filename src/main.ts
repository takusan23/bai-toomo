import { game } from "@akashic/akashic-engine/index.runtime";
import { GameMainParameterObject, RPGAtsumaruWindow } from "./parameterObject"
import EndScene from "./scene/EndScene";
import GameScene from "./scene/GameScene";
import TitleScene from "./scene/TitleScene";

declare const window: RPGAtsumaruWindow

/** ゲーム時間。1分だが、最初と最後の画面を表示する様に各5秒確保している。 */
const GAME_TIME_SEC = 60 + 10

/** タイトル表示時間（ミリ秒） */
const TITLE_VISIBLE_TIME_MS = 5_000

export function main(param: GameMainParameterObject): void {

	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: ["player", "shot", "se"]
	});
	/** 制限時間 */
	let time = 70
	if (param.sessionParameter.totalTimeLimit) {
		// セッションパラメータで制限時間が指定されたらその値を使用します
		time = param.sessionParameter.totalTimeLimit
	}
	// 市場コンテンツのランキングモードでは、g.game.vars.gameState.score の値をスコアとして扱います
	g.game.vars.gameState = { score: 0 }

	// タイトル画面を作って切り替える
	const titleScene = TitleScene.createTitleScene()

	// 5秒待機してからゲーム開始
	titleScene.setTimeout(() => {
		// クラスの切り出した
		const gameScene = new GameScene()
		// 5秒引いておく
		time -= 5

		const updateHandler = () => {
			if (time <= 0) {
				// ゲームアツマール環境であればランキングを表示します
				if (param.isAtsumaru) {
					const boardId = 1
					window.RPGAtsumaru.experimental.scoreboards.setRecord(boardId, g.game.vars.gameState.score).then(function () {
						window.RPGAtsumaru.experimental.scoreboards.display(boardId)
					});
				}
				// カウントダウンを止めるためにこのイベントハンドラを削除します
				scene.onUpdate.remove(updateHandler)
			}
			// カウントダウン処理
			time -= 1 / g.game.fps
			// 残り時間を表示。ゲームが遊べる時は60秒。でもゲームは65秒あるので引いておく。
			gameScene.setTimeText(time - 5)

			// 時間が残り5秒前になったら終了画面に切り替える
			if (time <= 5) {
				g.game.pushScene(EndScene.createEndScene())
			}

		}
		gameScene.scene.onUpdate.add(updateHandler)
		g.game.pushScene(gameScene.scene)

	}, TITLE_VISIBLE_TIME_MS)
	g.game.pushScene(titleScene)
}
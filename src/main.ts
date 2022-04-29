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

	/** 制限時間 */
	let time = GAME_TIME_SEC
	if (param.sessionParameter.totalTimeLimit) {
		// セッションパラメータで制限時間が指定されたらその値を使用します
		time = param.sessionParameter.totalTimeLimit
	}

	// 市場コンテンツのランキングモードでは、g.game.vars.gameState.score の値をスコアとして扱います
	g.game.vars.gameState = { score: 0 }

	// タイトル画面を作って切り替える
	const titleScene = TitleScene.createTitleScene()
	// ゲーム画面クラス
	const gameScene = new GameScene((addPoint) => {
		// 点数加点
		g.game.vars.gameState.score += addPoint
		gameScene.setScoreText(g.game.vars.gameState.score)
	})

	// 5秒待機してからゲーム開始
	titleScene.setTimeout(() => {
		// 5秒引いておく
		time -= 5

		// 最後のダンボール送出を終えたか
		const updateHandler = () => {
			// カウントダウン処理
			time -= 1 / g.game.fps

			// 残り時間を表示。ゲームが遊べる時は60秒。でもゲームは65秒あるので引いておく。
			gameScene.setTimeText(time - 5)

			// 時間が残り5秒前になったら終了画面に切り替える
			if (time <= 5) {
				// 今あるダンボールを最後送る
				g.game.vars.gameState.score += gameScene.nextBox()
				// 終了画面へ
				// GameSceneクラス内のonUpate呼び出しは自動的に解除される(らしい)
				const boxCount = gameScene.getBoxCount()
				const score = g.game.vars.gameState.score as number
				g.game.pushScene(EndScene.createEndScene(score, boxCount))

				// ゲームアツマール環境であればランキングを表示します
				if (param.isAtsumaru) {
					const boardId = 1
					window.RPGAtsumaru.experimental.scoreboards.setRecord(boardId, g.game.vars.gameState.score).then(function () {
						window.RPGAtsumaru.experimental.scoreboards.display(boardId)
					});
				}

			}
		}
		gameScene.scene.onUpdate.add(updateHandler)

		// ゲーム画面へ切り替え
		g.game.pushScene(gameScene.scene)

	}, TITLE_VISIBLE_TIME_MS)
	g.game.pushScene(titleScene)
}

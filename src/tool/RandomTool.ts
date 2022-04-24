/** AkashicEngine の乱数生成器を簡単に扱えるようにしたもの */
class RandomTool {

    /**
     * 範囲内でランダムな値を出す
     * 
     * @link https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
     * 
     * @param min 最低値
     * @param max 最高値
     * @return ランダムな値
     */
    static getRandom = (min: number, max: number): number => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(g.game.random.generate() * (max - min) + min)
    }

    /**
     * 配列の中からランダムで取り出す
     * 
     * @param list ランダムで取り出したい配列
     * @return 配列からランダムで取り出した中身
     */
    static randomFromArray = <T>(list: Array<T>): T => {
        const randomNumber = g.game.random.generate()
        return list[Math.floor(randomNumber * list.length)]
    }

}

export default RandomTool
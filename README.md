# bai-toomo

## 開発環境構築

- Node.js を入れる
- このリポジトリをクローンするなりしてソースコードを手に入れる
- プロジェクトフォルダ内でターミナルを開く
- `npm i` を実行

ここまでは初回時のみやってください。  
あとは以下のコマンドを叩くことで、開発サーバーが起動します。

```
npm run start
```

`http://localhost:3000/game/`だと思います。

## エクスポート方法

`typescript-shin-ichiba-ranking-game-sample` をエクスポートするときは以下のコマンドを利用します。

### htmlファイルのエクスポート

`npm run export-html` のコマンドを利用することで `game` ディレクトリにエクスポートすることができます。

`game/index.html` をブラウザで開くと単体動作させることができます。

### zipファイルのエクスポート

`npm run export-zip` のコマンドを利用することで `game.zip` という名前のzipファイルを出力できます。

## テスト方法

1. [TSLint](https://github.com/palantir/tslint "TSLint")を使ったLint
2. [Jest](https://jestjs.io/ "Jest")を使ったテスト

がそれぞれ実行されます。

```sh
npm test
```

テストコードのサンプルとして `spec/testSpec.js` を用意していますので参考にしてテストコードを記述して下さい。

## そのほか

- 書かれた TypeScript は ES5なJavaScript で動くようにトランスパイルされるようになっています
    - Akashic Engine 的には ES5 以降の機能は使わないほうが良いみたい
    - コールバック地獄しんどくない？、async / await ほしい
# ①課題名
ジョジョの奇妙なマッチングアプリ

## ②課題内容（どんな作品か）
- ジョジョの奇妙な冒険に登場するキャラクターを様々な条件で検索できるマッチングアプリ
- 各キャラクターの詳細情報（出身、性格、体型など）を表示し、お気に入りや履歴管理ができる
- 直感的なUIでキャラクターとの相性を探せるWebアプリケーション

![image](https://github.com/user-attachments/assets/2d906366-41b6-4f24-b8d8-0b9812b63ee6)

## ③アプリのデプロイURL
https://takahashi244.github.io/kadai03_memo/

## ④アプリのログイン用IDまたはPassword（ある場合）
- ログイン機能はありません

## ⑤工夫した点・こだわった点
- キャラクターカードのデザインと表示を最適化（ホバーエフェクト、影など）
- 長い名前や説明文が見切れないよう、テキストサイズと高さを自動調整
- いいねボタンの直感的な操作性と状態の視覚的フィードバック
- LocalStorageを活用したお気に入りと閲覧履歴の永続化
- 様々な画面サイズに対応するレスポンシブデザインの実装
- 検索条件の組み合わせで柔軟にキャラクターを絞り込める機能性

## ⑥難しかった点・次回トライしたいこと（又は機能）
- テキスト表示の最適化（長い名前や説明文が見切れず、かつデザインが崩れないように調整）
- ページ間でのいいね状態の同期と正確な反映
- グリッドレイアウトとレスポンシブ対応の微調整
- 次回は検索結果のソート機能や、より詳細なキャラクター情報表示機能を追加したい
- データベースと連携してユーザー登録やコメント機能なども実装してみたい

## ⑦フリー項目（感想、シェアしたいこと等なんでも）
- [感想]
  - JavaScriptでのローカルストレージ操作とデータ永続化の重要性を学んだ
  - レスポンシブデザインの実装で、様々な画面サイズへの対応方法を深く理解できた
  - CSSの変数やグリッドレイアウトを活用することで、一貫したデザインの実現と保守性の高いコードが書けることを実感
  - いいねや閲覧履歴といった機能を実装することで、ユーザー体験の向上について考える機会になった
  - コードの分割と最適化を通じて、より効率的なJavaScriptの書き方を学ぶことができた

- [参考記事]
  - 1. [Font Awesome](https://fontawesome.com/) - アイコン表示
  - 2. [Google Fonts](https://fonts.google.com/) - 「Kaisei Opti」などのフォントを使用

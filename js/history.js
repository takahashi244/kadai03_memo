// ページ読み込み時に実行
$(document).ready(function() {
  // 閲覧履歴一覧を表示
  displayHistoryCharacters();
  
  // いいねボタンのイベント処理
  $(document).on('click', '.like-button', function() {
    const characterId = $(this).data('id');
    toggleLike(characterId);
    
    // いいねボタンの表示を更新
    $(this).toggleClass('liked');
  });
});

// 閲覧履歴のキャラクター一覧を表示
function displayHistoryCharacters() {
  // 履歴リストと全キャラクターデータを取得
  const history = JSON.parse(localStorage.getItem('jojoHistory')) || [];
  const characters = JSON.parse(localStorage.getItem('jojoCharacters')) || [];
  const likes = JSON.parse(localStorage.getItem('jojoLikes')) || [];
  
  // 履歴カウントを更新
  $('#historyCount').text(history.length);
  
  // コンテナをクリア
  const $historyContainer = $('#historyContainer');
  $historyContainer.empty();
  
  // 履歴がない場合
  if (history.length === 0) {
    $historyContainer.append('<p class="no-results">閲覧履歴はまだありません</p>');
    return;
  }
  
  // 履歴リストに含まれるキャラクターを表示
  history.forEach(historyId => {
    // キャラクターを検索
    const character = characters.find(char => char.id === historyId);
    if (character) {
      // いいね状態の確認
      const isLiked = likes.includes(character.id);
      
      // キャラクターカードを作成
      const $characterCard = $(`
        <div class="result-card">
          <div class="result-image">
            <img src="${character.image}" alt="${character.name}">
          </div>
          <div class="result-info">
            <h4 class="result-name">${character.name}</h4>
            <p class="result-details">${character.age}歳 / ${character.originText}</p>
            <p class="result-details">${character.personalityText} / ${character.bodyTypeText}</p>
            <p class="result-description">${character.description}</p>
            <div class="result-actions">
              <button class="like-button ${isLiked ? 'liked' : ''}" data-id="${character.id}">
                <i class="fas fa-heart"></i> いいね
              </button>
            </div>
          </div>
        </div>
      `);
      
      // カードを追加
      $historyContainer.append($characterCard);
    }
  });
}
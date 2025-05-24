// ページ読み込み時に実行
$(document).ready(function() {
  // いいねリストを表示
  displayLikedCharacters();
  
  // いいねボタンのイベント処理
  $(document).on('click', '.like-button', function() {
    const characterId = $(this).data('id');
    toggleLike(characterId);
    
    // いいねボタンの表示を更新
    $(this).toggleClass('liked');
    
    // いいねを解除した場合、カード要素を削除
    if (!$(this).hasClass('liked')) {
      $(this).closest('.result-card').fadeOut(300, function() {
        $(this).remove();
        updateLikeCount();
      });
    }
  });
});

// いいねしたキャラクター一覧を表示
function displayLikedCharacters() {
  // いいねリストと全キャラクターデータを取得
  const likes = JSON.parse(localStorage.getItem('jojoLikes')) || [];
  const characters = JSON.parse(localStorage.getItem('jojoCharacters')) || [];
  
  // いいねカウントを更新
  updateLikeCount();
  
  // コンテナをクリア
  const $likesContainer = $('#likesContainer');
  $likesContainer.empty();
  
  // いいねがない場合
  if (likes.length === 0) {
    $likesContainer.append('<p class="no-results">いいねしたキャラクターはまだありません</p>');
    return;
  }
  
  // いいねリストに含まれるキャラクターを表示
  likes.forEach(likedId => {
    // キャラクターを検索
    const character = characters.find(char => char.id === likedId);
    if (character) {
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
              <button class="like-button liked" data-id="${character.id}">
                <i class="fas fa-heart"></i> いいね
              </button>
            </div>
          </div>
        </div>
      `);
      
      // カードを追加
      $likesContainer.append($characterCard);
    }
  });
}

// いいねカウントを更新する関数
function updateLikeCount() {
  const likes = JSON.parse(localStorage.getItem('jojoLikes')) || [];
  $('#likeCount').text(likes.length);
}
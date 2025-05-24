// ページ読み込み時の処理
$(document).ready(function() {
  // 現在のページURLを取得
  const currentPage = window.location.pathname.split('/').pop();
  
  // 各ナビゲーションリンクのチェック
  $('.nav-link').each(function() {
    const linkHref = $(this).attr('href');
    
    // リンクのhref属性が現在のページと一致する場合、親要素にactiveクラスを追加
    if (linkHref === currentPage) {
      $(this).parent().addClass('active').siblings().removeClass('active');
    }
  });
  
  // ナビゲーションのリンククリック時の処理
  $('.nav-link').on('click', function() {
    // 全てのナビアイテムからactiveクラスを削除し、クリックされた要素の親要素にactiveクラスを追加
    $('.nav-item').removeClass('active');
    $(this).parent().addClass('active');
  });
  
  // モックデータをLocalStorageに保存（初期データ）
  initializeCharacterData();
  
  // 検索フォームの処理を初期化
  initializeSearchForm();
  
  // いいねボタンのイベント処理を追加
  $(document).on('click', '.like-button', function() {
    const characterId = $(this).data('id');
    toggleLike(characterId);
    $(this).toggleClass('liked');
  });
});

// キャラクターデータを取得する関数（外部ファイルのデータを利用）
function getCharacterData() {
  return jojoCharacters; // 外部ファイルで定義された変数を返す
}

// キャラクターデータを初期化する関数
function initializeCharacterData() {
  // すでにデータがある場合は初期化しない
  if (localStorage.getItem('jojoCharacters')) {
    return;
  }
  
  // キャラクターの初期データを関数から取得
  const characterData = getCharacterData();
  
  // LocalStorageにデータを保存
  localStorage.setItem('jojoCharacters', JSON.stringify(characterData));
  
  // いいねと閲覧履歴のデータ構造も初期化
  if (!localStorage.getItem('jojoLikes')) {
    localStorage.setItem('jojoLikes', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('jojoHistory')) {
    localStorage.setItem('jojoHistory', JSON.stringify([]));
  }
}

// 検索フォームの初期化
function initializeSearchForm() {
  $('#searchForm').on('submit', function(e) {
    e.preventDefault(); // フォームのデフォルト送信を防止
    
    // フォームの値を取得
    const origin = $('#origin').val();
    const bodyType = $('#bodyType').val();
    const personality = $('#personality').val();
    const gender = $('#gender').val();
    
    // 検索条件をコンソールに表示（デバッグ用）
    console.log('検索条件:', {
      出身地: origin,
      体型: bodyType,
      性格: personality,
      性別: gender
    });
    
    // LocalStorageから条件に合うキャラクターを検索
    const results = searchCharacters(origin, bodyType, personality, gender);
    
    // 結果を表示
    displaySearchResults(results);
  });
}

// キャラクターを検索する関数（完全版）
function searchCharacters(origin, bodyType, personality, gender) {
  // LocalStorageからキャラクターデータを取得
  const characters = JSON.parse(localStorage.getItem('jojoCharacters'));
  
  // 条件に合うキャラクターをフィルタリング
  return characters.filter(character => {
    // 各条件をチェック（空の場合はその条件を無視）
    const matchOrigin = origin ? character.origin === origin : true;
    const matchBodyType = bodyType ? character.bodyType === bodyType : true;
    const matchPersonality = personality ? character.personality === personality : true;
    const matchGender = gender ? character.gender === gender : true;
    
    // すべての条件にマッチするものだけを返す
    return matchOrigin && matchBodyType && matchPersonality && matchGender;
  });
}

// 検索結果を表示する関数（完全版）
function displaySearchResults(results) {
  // 結果の数を表示
  $('#resultCount').text(results.length);
  
  // 結果をクリアして新しい結果を表示
  const $resultsContainer = $('#resultsContainer');
  $resultsContainer.empty();
  
  // 結果がない場合のメッセージ
  if (results.length === 0) {
    $resultsContainer.append('<p class="no-results">条件に一致するキャラクターが見つかりませんでした</p>');
    return;
  }
  
  // 各結果をDOMに追加
  results.forEach(result => {
    // いいね済みかどうかをチェック
    const likes = JSON.parse(localStorage.getItem('jojoLikes')) || [];
    const isLiked = likes.includes(result.id);
    
    // 閲覧履歴に追加
    addToHistory(result.id);
    
    // 結果カードを作成して追加
    const $resultCard = $(`
      <div class="result-card">
        <div class="result-image">
          <img src="${result.image}" alt="${result.name}">
        </div>
        <div class="result-info">
          <h4 class="result-name">${result.name}</h4>
          <p class="result-details">${result.age}歳 / ${result.originText}</p>
          <p class="result-details">${result.personalityText} / ${result.bodyTypeText}</p>
          <p class="result-description">${result.description}</p>
          <div class="result-actions">
            <button class="like-button ${isLiked ? 'liked' : ''}" data-id="${result.id}">
              <i class="fas fa-heart"></i> いいね
            </button>
          </div>
        </div>
      </div>
    `);
    
    $resultsContainer.append($resultCard);
  });
  
  // 説明文のテキストサイズを自動調整
  adjustDescriptionTextSize();
}

// 説明文のテキストサイズ自動調整関数
function adjustDescriptionTextSize() {
  $('.result-description').each(function() {
    const $description = $(this);
    const text = $description.text();
    const defaultFontSize = parseInt($description.css('font-size'));
    
    // 文字数に基づいてフォントサイズを調整
    if (text.length > 120) {
      // 非常に長いテキスト（120文字以上）
      $description.css('font-size', (defaultFontSize - 2) + 'px');
    } else if (text.length > 80) {
      // 長めのテキスト（80-120文字）
      $description.css('font-size', (defaultFontSize - 1) + 'px'); 
    }
  });
}

// いいねの切り替え処理
function toggleLike(characterId) {
  // LocalStorageからいいねリストを取得
  const likes = JSON.parse(localStorage.getItem('jojoLikes')) || [];
  
  // いいね済みかどうかをチェック
  const index = likes.indexOf(characterId);
  
  if (index === -1) {
    // いいねしていなければ追加
    likes.push(characterId);
  } else {
    // いいね済みなら削除
    likes.splice(index, 1);
  }
  
  // LocalStorageに保存
  localStorage.setItem('jojoLikes', JSON.stringify(likes));
}

// 閲覧履歴に追加する関数
function addToHistory(characterId) {
  // LocalStorageから閲覧履歴を取得
  const history = JSON.parse(localStorage.getItem('jojoHistory')) || [];
  
  // 既に履歴にあれば削除（新しい位置に追加するため）
  const index = history.indexOf(characterId);
  if (index !== -1) {
    history.splice(index, 1);
  }
  
  // 先頭に追加
  history.unshift(characterId);
  
  // 履歴は最大20件まで
  const limitedHistory = history.slice(0, 20);
  
  // LocalStorageに保存
  localStorage.setItem('jojoHistory', JSON.stringify(limitedHistory));
}
// ページ読み込み時の処理
$(document).ready(function () {
  // 現在のページURLを取得とナビゲーション初期化
  const currentPage = window.location.pathname.split("/").pop();

  $(".nav-link").each(function () {
    if ($(this).attr("href") === currentPage) {
      $(this).parent().addClass("active").siblings().removeClass("active");
    }
  });

  // ナビゲーションクリック処理
  $(".nav-link").on("click", function () {
    $(".nav-item").removeClass("active");
    $(this).parent().addClass("active");
  });

  // データと機能の初期化
  initializeCharacterData();
  initializeSearchForm();

  // いいねボタンのイベント処理を改善
  $(document).on("click", ".like-button", function () {
    const characterId = $(this).data("id");
    toggleLike(characterId);

    // いいねボタンの表示を更新
    $(this).toggleClass("liked");

    // 現在のページを取得
    const currentPage = window.location.pathname.split("/").pop();

    // ボタンのテキストとアイコン更新（ページによって表示を変更）
    const isLiked = $(this).hasClass("liked");
    if (currentPage === "likes.html") {
      // いいねページでは「いいね中」と表示
      $(this).html(`<i class="fas fa-heart"></i> いいね中`);
    } else {
      // さがすページと閲覧履歴ページでは常に「いいね」と表示
      $(this).html(`<i class="fas fa-heart"></i> いいね`);
    }

    // いいねページ特有の処理 - カードを削除
    if (currentPage === "likes.html" && !isLiked) {
      $(this)
        .closest(".result-card")
        .fadeOut(300, function () {
          $(this).remove();
          updateLikeCount();
        });
    }
  });
});

// キャラクターデータを取得する関数
function getCharacterData() {
  return jojoCharacters; // 外部ファイルで定義された変数を返す
}

// キャラクターデータを初期化する関数
function initializeCharacterData() {
  // 既存データがある場合は初期化不要
  if (localStorage.getItem("jojoCharacters")) {
    return;
  }

  // キャラクターデータを保存
  localStorage.setItem("jojoCharacters", JSON.stringify(getCharacterData()));

  // 関連データ構造の初期化
  if (!localStorage.getItem("jojoLikes")) {
    localStorage.setItem("jojoLikes", JSON.stringify([]));
  }

  if (!localStorage.getItem("jojoHistory")) {
    localStorage.setItem("jojoHistory", JSON.stringify([]));
  }
}

// 検索フォームの初期化
function initializeSearchForm() {
  $("#searchForm").on("submit", function (e) {
    e.preventDefault();

    // フォーム値取得
    const origin = $("#origin").val();
    const bodyType = $("#bodyType").val();
    const personality = $("#personality").val();
    const gender = $("#gender").val();

    // 検索と結果表示
    const results = searchCharacters(origin, bodyType, personality, gender);
    displaySearchResults(results);
  });
}

// キャラクターを検索する関数
function searchCharacters(origin, bodyType, personality, gender) {
  const characters = JSON.parse(localStorage.getItem("jojoCharacters"));

  // 条件によるフィルタリング
  return characters.filter((character) => {
    const matchOrigin = origin ? character.origin === origin : true;
    const matchBodyType = bodyType ? character.bodyType === bodyType : true;
    const matchPersonality = personality
      ? character.personality === personality
      : true;
    const matchGender = gender ? character.gender === gender : true;

    return matchOrigin && matchBodyType && matchPersonality && matchGender;
  });
}

// 検索結果を表示する関数
function displaySearchResults(results) {
  const $resultsContainer = $("#resultsContainer");
  $resultsContainer.empty();
  $("#resultCount").text(results.length);

  // 結果がない場合
  if (results.length === 0) {
    $resultsContainer.append(
      '<p class="no-results">条件に一致するキャラクターが見つかりませんでした</p>'
    );
    return;
  }

  // いいねリストを一度だけ取得（パフォーマンス向上）
  const likes = JSON.parse(localStorage.getItem("jojoLikes")) || [];

  // 各結果をDOMに追加
  results.forEach((result) => {
    // 閲覧履歴に追加
    addToHistory(result.id);

    // いいね状態の確認
    const isLiked = likes.includes(result.id);

    // 結果カード生成
    const $resultCard = $(`
      <div class="result-card">
        <div class="result-image">
          <img src="${result.image}" alt="${result.name}">
        </div>
        <div class="result-info">
          <h4 class="result-name">${result.name}</h4>
          <p class="result-details">${result.age}歳 / ${result.originText}</p>
          <p class="result-details">${result.personalityText} / ${
      result.bodyTypeText
    }</p>
          <p class="result-description">${result.description}</p>
          <div class="result-actions">
            <button class="like-button ${isLiked ? "liked" : ""}" data-id="${
      result.id
    }">
              <i class="fas fa-heart"></i> いいね
            </button>
          </div>
        </div>
      </div>
    `);

    $resultsContainer.append($resultCard);
  });
}

// いいねの切り替え処理
function toggleLike(characterId) {
  const likes = JSON.parse(localStorage.getItem("jojoLikes")) || [];
  const index = likes.indexOf(characterId);

  // いいね追加/削除
  if (index === -1) {
    likes.push(characterId);
  } else {
    likes.splice(index, 1);
  }

  localStorage.setItem("jojoLikes", JSON.stringify(likes));
}

// いいねカウント更新関数（グローバルに）
function updateLikeCount() {
  const likes = JSON.parse(localStorage.getItem("jojoLikes")) || [];
  $("#likeCount").text(likes.length);

  // いいねがなくなった場合のメッセージ
  if (likes.length === 0 && $("#likesContainer").length > 0) {
    $("#likesContainer")
      .empty()
      .append(
        '<p class="no-results">いいねしたキャラクターはまだありません</p>'
      );
  }
}

// 閲覧履歴に追加する関数
function addToHistory(characterId) {
  const history = JSON.parse(localStorage.getItem("jojoHistory")) || [];

  // 既存履歴から削除（重複防止）
  const index = history.indexOf(characterId);
  if (index !== -1) {
    history.splice(index, 1);
  }

  // 先頭に追加
  history.unshift(characterId);

  // 履歴は最大20件まで
  const limitedHistory = history.slice(0, 20);

  localStorage.setItem("jojoHistory", JSON.stringify(limitedHistory));
}

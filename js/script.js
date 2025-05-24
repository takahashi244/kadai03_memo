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
});
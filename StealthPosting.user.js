"use strict";

/********************************************
  *** 各種ボタン設定
  ********************************************/

/**
 * 【!!!】この設定値は変更しないでください。汎用性が著しく失われます。
 */
var defaultMessage = 'To display this comment more stylishly, see: ';

// カスタムコメント
var customComment = 'Like :+1:';

// リポジトリURL
var repoURL = 'https://github.com/nezumi650/StealthPosting';

// ボタン画像(背景透過)
var imgPath = 'https://github.com/nezumi650/StealthPosting/blob/master/Like.png';

// ボタン画像の縦横
var imgWidth  = 50;
var imgHeight = 25;

// ボタン画像の背景色
// @TODO もっとかっこよくエフェクトさせる
var bkColor        = 'white';
var bkColorClicked = 'yellow';


/********************************************
  *** ミニアバター画像設定
  ********************************************/

// ミニアバター画像の縦横
var avatarSettingImgWidth  = 25;
var avatarSettingImgHeight = 25;

// ミニアバター画像表示部の文言
var avatarSettingLabel = '<span style="font-size: 1px; color: #cccccc;">Got Like from :</span> '



/********************************************
  *** 実処理
  ********************************************/
// イシュー自体にイイネボタン追加
// addLikeButtonIssue(); @TODO あとで

// コメントにイイネボタン追加
addLikeButtonComments();

// ミニアバターの追加、イイネコメントのhide
var allLikeComments = getAllLikeComments();
addLikeIcon(allLikeComments);
hideAllLikeComments(allLikeComments);





/********************************************
  *** 関数群
  ********************************************/

/**
  * いいねボタン自体を作成
  */
function createLikeButton() {
  // ボタンを用意
  var LikeImg      = document.createElement('img');
  LikeImg.width  = imgWidth;
  LikeImg.height = imgHeight;
  LikeImg.style.backgroundColor = bkColor;
  LikeImg.src      = imgPath;

  return LikeImg;
}

/**
  * issue 自体にいいねボタン追加
  * @TODO これまだ使ってない
  */
function addLikeButtonIssue() {
  // ボタンを用意
  var LikeImg = createLikeButton();
  // クリックされた時のイベントを用意
  LikeImg.addEventListener('click', postNiceIssue, false);

  // ボタンを配置する場所を用意
  var element = document.createElement('p');
  element.style.textAlign = 'right';
  // 配置
  element.appendChild(LikeImg);

  // HTMLに入れ込む
  var issueElm = document.querySelector( '[id^="issue-"]' );
  var commentHeaderElm = issueElm.querySelector('.discussion-topic-author');
  commentHeaderElm.appendChild(element);
}

/**
  * issue 自体のいいねボタンのイベント
  * @TODO これまだ使ってない
  */
function postNiceIssue(){
  // いいねボタンを一瞬黄色にする
  var buttonImgElm = this;
  changeColor(buttonImgElm, bkColorClicked);
  postComment('This issue');
  // いいねボタンを白色に戻す
  setTimeout( function(){changeColor(buttonImgElm, bkColor)}, 300);
};

/**
  * コメントにいいねボタン追加
  */
function addLikeButtonComments() {
  var commentElms = document.querySelectorAll( '[id^="issuecomment-"]' );

  for (var i = 0; i < commentElms.length; i++) {
    var commentHeaderElm = commentElms[i].querySelector('.comment-header-right');
    var element = document.createElement('span');

    element.dataset.issueCommentId = commentElms[i].id;

    var LikeImg = createLikeButton();
    element.addEventListener('click', postNice, false);

    element.appendChild(LikeImg);
    commentHeaderElm.appendChild(element);
  }
}

/**
  * コメントのいいねボタンのイベント
  */
function postNice(){
  var issueCommentId = this.dataset.issueCommentId;
  // いいねボタンを一瞬黄色にする
  var buttonImgElm = this.querySelector('img');
  changeColor(buttonImgElm, bkColorClicked);
  postComment(issueCommentId);
  // いいねボタンを白色に戻す
  setTimeout( function(){changeColor(buttonImgElm, bkColor)}, 300);
};

/**
  * いいねボタンの色の変更
  */
function changeColor(imgElm, color) {
  imgElm.style.backgroundColor = color;
}

/**
  * いいねコメントの一覧を、いいね元のコメントid毎に取得
  */
function getAllLikeComments() {
  var discussionBubbles = document.querySelectorAll('.discussion-bubble');
  var LikeComments = {};
  for (var i = 0; i < discussionBubbles.length; i++) {
    var discussionBubble = discussionBubbles[i];

    // いいねボタンっぽいコメントかどうかチェック
    var commentBodyText = discussionBubble.querySelector('.comment-body').textContent;
    if (commentBodyText.search(defaultMessage) != -1) {
      // いいねボタンっぽいコメントだった場合、どのコメントに対するいいねなのかを取得
      var reCom  = /issuecomment-[0-9]+/;
      var matches = commentBodyText.match(reCom);

      if (matches) {
        var originalCommentId = matches[0];
      } else {
        var originalCommentId = 'issue';
      }
      if (!LikeComments[originalCommentId]) {
        LikeComments[originalCommentId] = [];
      }
      LikeComments[originalCommentId].push(discussionBubble);
    }
  }
  return LikeComments;
}

/**
  * いいねコメントを非表示にする
  */
function hideAllLikeComments(discussionBubblesAllArray) {
  for (var parentId in discussionBubblesAllArray){
    var discussionBubblesArray = discussionBubblesAllArray[parentId];
    for (var i = 0; i < discussionBubblesArray.length; i++) {
      discussionBubblesArray[i].style.display = 'none';
    }
  }
}

/**
  * いいねコメントを削除する
  * @TODO 実装
  */
function deleteLikeComment() {
  var commentId = this.getAttribute('for');
}


/**
  * いいねした人のアイコンを小さく表示する
  */
function addLikeIcon(discussionBubblesAllArray) {

  for (var parentId in discussionBubblesAllArray){
    if (parentId === 'issue') {
      //@TODO
    } else {
      var parentElm = document.getElementById(parentId);
    }

    // アイコンを表示する場所を用意
    var avatarArea = parentElm.querySelector('.avatarArea');
    if (avatarArea) {
      // すでにあれば、一回中身を削除
      avatarArea.innerHTML = avatarSettingLabel;
    } else {
      // まだ無ければ作成
      avatarArea = document.createElement('p');
      avatarArea.style.textAlign = 'right';
      avatarArea.className = 'avatarArea';
      avatarArea.innerHTML = avatarSettingLabel;
      // HTMLに入れ込む
      parentElm.appendChild(avatarArea);
    }

    var discussionBubblesArray = discussionBubblesAllArray[parentId];
    for (var i = 0; i < discussionBubblesArray.length; i++) {
      var commentId = discussionBubblesArray[i].querySelector('[id^="issuecomment-"]').getAttribute('id');
      var avatarImgElm = discussionBubblesArray[i].querySelector('.discussion-bubble-avatar');
      // 小さいアバター画像を作成
      var avatarImg      = document.createElement('img');
      avatarImg.width  = avatarSettingImgWidth;
      avatarImg.height = avatarSettingImgHeight;
//      avatarImg.onclick = deleteLikeComment; @TODO アイコンクリックでイイネコメント削除
      avatarImg.src      = avatarImgElm.getAttribute('src');
      avatarImg.setAttribute('for', commentId);

      // 小さいアバター画像をHTMLに入れ込む
      avatarArea.appendChild(avatarImg);
    }
  }
}





// ----------------

// コメントを引数で受け取ってポスト

function postComment(target) {
  // フォームにコメントを挿入
  var commentForm = document.querySelector( '[id^="comment_body_"]' );
  commentForm.value = '<p class="LikeComment"> ' + target + ' ' + customComment + ' ' + '<br />' + defaultMessage + repoURL + '</p>';

  var submitButton = document.querySelector('.form-actions:last-child button[type="submit"]:last-child');
  var mouseEvents = document.createEvent("MouseEvents");
  mouseEvents.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  submitButton.dispatchEvent( mouseEvents );

  // ちょっと待たないと書き込み終わってなくてhideできないので苦肉の対応
  // @TODO もうちょっとかっこ良くしたい。。。。
  setTimeout( function(){
    var allLikeComments = getAllLikeComments();
    addLikeIcon(allLikeComments);
    hideAllLikeComments(allLikeComments);
  }, 800);
}










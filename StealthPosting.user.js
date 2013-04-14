"use strict";

/********************************************
  *** 各種ボタン設定
  ********************************************/

/**
 * 【!!!】この設定値は変更しないでください。汎用性が著しく失われます。
 */
var defaultMessage = 'To display this comment more stylishly, see: ';

// カスタムコメント
var customComment = 'Stealth :+1:';

// リポジトリURL
var repoURL = 'https://github.com/nezumi650/StealthPosting';

// ボタン画像(背景透過)
var imgPath = 'https://github.com/nezumi650/StealthPosting/blob/master/iine.png';

// ボタン画像の縦横
var imgWidth  = 50;
var imgHeight = 25;

// ボタン画像の背景色
var bkColor        = 'white';
var bkColorClicked = 'yellow';


/********************************************
  *** ミニアバター画像設定
  ********************************************/

// ミニアバター画像の縦横
var avatarSettingImgWidth  = 25;
var avatarSettingImgHeight = 25;

// ミニアバター画像表示部の文言
var avatarSettingLabel = '<span style="font-size: 1px; color: #cccccc;">Got ' + customComment + ' from :</span> '



/********************************************
  *** 実処理
  ********************************************/
// イシュー自体にイイネボタン追加
// addStealthButtonIssue(); @TODO あとで

// コメントにイイネボタン追加
addStealthButtonComments();

// ミニアバターの追加、イイネコメントのhide
var allStealthComments = getAllStealthComments();
addStealthIcon(allStealthComments);
hideAllStealthComments(allStealthComments);





/********************************************
  *** 関数群
  ********************************************/

/**
  * ステルスポストボタン自体を作成
  */
function createStealthButton() {
  // ボタンを用意
  var StealthImg    = document.createElement('img');
  StealthImg.width  = imgWidth;
  StealthImg.height = imgHeight;
  StealthImg.style.backgroundColor = bkColor;
  StealthImg.src    = imgPath;

  return StealthImg;
}

/**
  * issue 自体にステルスポストボタン追加
  * @TODO これまだ使ってない
  */
function addStealthButtonIssue() {
  // ボタンを用意
  var StealthImg = createStealthButton();
  // クリックされた時のイベントを用意
  StealthImg.addEventListener('click', postStealthIssue, false);

  // ボタンを配置する場所を用意
  var element = document.createElement('p');
  element.style.textAlign = 'right';
  // 配置
  element.appendChild(StealthImg);

  // HTMLに入れ込む
  var issueElm = document.querySelector( '[id^="issue-"]' );
  var commentHeaderElm = issueElm.querySelector('.discussion-topic-author');
  commentHeaderElm.appendChild(element);
}

/**
  * issue 自体のステルスポストボタンのイベント
  * @TODO これまだ使ってない
  */
function postStealthIssue(){
  // ステルスポストボタンを一瞬黄色にする
  var buttonImgElm = this;
  changeColor(buttonImgElm, bkColorClicked);
  postComment('This issue');
  // ステルスポストボタンを白色に戻す
  setTimeout( function(){changeColor(buttonImgElm, bkColor)}, 300);
};

/**
  * コメントにステルスポストボタン追加
  */
function addStealthButtonComments() {
  var commentElms = document.querySelectorAll( '[id^="issuecomment-"]' );

  for (var i = 0; i < commentElms.length; i++) {
    var commentHeaderElm = commentElms[i].querySelector('.comment-header-right');
    var element = document.createElement('span');

    element.dataset.issueCommentId = commentElms[i].id;

    var StealthImg = createStealthButton();
    element.addEventListener('click', postStealth, false);

    element.appendChild(StealthImg);
    commentHeaderElm.appendChild(element);
  }
}

/**
  * コメントのステルスポストボタンのイベント
  */
function postStealth(){
  var issueCommentId = this.dataset.issueCommentId;
  // ステルスポストボタンを一瞬黄色にする
  var buttonImgElm = this.querySelector('img');
  changeColor(buttonImgElm, bkColorClicked);
  postComment(issueCommentId);
  // ステルスポストボタンを白色に戻す
  setTimeout( function(){changeColor(buttonImgElm, bkColor)}, 300);
};

/**
  * ステルスポストボタンの色の変更
  */
function changeColor(imgElm, color) {
  imgElm.style.backgroundColor = color;
}

/**
  * ステルスポストコメントの一覧を、ステルスポスト元のコメントid毎に取得
  */
function getAllStealthComments() {
  var discussionBubbles = document.querySelectorAll('.discussion-bubble');
  var StealthComments = {};
  for (var i = 0; i < discussionBubbles.length; i++) {
    var discussionBubble = discussionBubbles[i];

    // ステルスポストっぽいコメントかどうかチェック
    var commentBodyText = discussionBubble.querySelector('.comment-body').textContent;
    if (commentBodyText.search(defaultMessage) != -1) {
      // ステルスポストっぽいコメントだった場合、どのコメントに対するステルスポストなのかを取得
      var reCom  = /issuecomment-[0-9]+/;
      var matches = commentBodyText.match(reCom);

      if (matches) {
        var originalCommentId = matches[0];
      } else {
        var originalCommentId = 'issue';
      }
      if (!StealthComments[originalCommentId]) {
        StealthComments[originalCommentId] = [];
      }
      StealthComments[originalCommentId].push(discussionBubble);
    }
  }
  return StealthComments;
}

/**
  * ステルスポストコメントを非表示にする
  */
function hideAllStealthComments(discussionBubblesAllArray) {
  for (var parentId in discussionBubblesAllArray){
    var discussionBubblesArray = discussionBubblesAllArray[parentId];
    for (var i = 0; i < discussionBubblesArray.length; i++) {
      discussionBubblesArray[i].style.display = 'none';
    }
  }
}

/**
  * ステルスポストコメントを削除する
  * @TODO 実装
  */
function deleteStealthComment() {
  var commentId = this.getAttribute('for');
}


/**
  * ステルスポストした人のアイコンを小さく表示する
  */
function addStealthIcon(discussionBubblesAllArray) {

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
    console.log(discussionBubblesArray);
    for (var commentCnt = 0; commentCnt < discussionBubblesArray.length; commentCnt++) {
      var commentId = discussionBubblesArray[commentCnt].querySelector('[id^="issuecomment-"]').getAttribute('id');
      var avatarImgElm = discussionBubblesArray[commentCnt].querySelector('.discussion-bubble-avatar');
      // 小さいアバター画像を作成
      var avatarImg      = document.createElement('img');
      avatarImg.width  = avatarSettingImgWidth;
      avatarImg.height = avatarSettingImgHeight;
//      avatarImg.onclick = deleteStealthComment; @TODO アイコンクリックでイイネコメント削除
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
  commentForm.value = '<p class="StealthComment"> ' + target + ' ' + customComment + ' ' + '<br />' + defaultMessage + repoURL + '</p>';

  var submitButton = document.querySelector('.form-actions:last-child button[type="submit"]:last-child');
  var mouseEvents = document.createEvent("MouseEvents");
  mouseEvents.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  submitButton.dispatchEvent( mouseEvents );

  // ちょっと待たないと書き込み終わってなくてhideできないので苦肉の対応
  // @TODO もうちょっとかっこ良くしたい。。。。
  setTimeout( function(){
    var allStealthComments = getAllStealthComments();
    addStealthIcon(allStealthComments);
    hideAllStealthComments(allStealthComments);
  }, 800);
}










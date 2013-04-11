/********************************************
  *** 各種ボタン設定
  *** @TODO ボタン複数個持てる様にしたいなー。。。
  ********************************************/

/**
 * 【!!!】この設定値は変更しないでください。汎用性が著しく失われます。
 */
var defaultMessage = 'To display this comment more stylishly, see: ';

// カスタムコメント
var customComment = 'IINE :+1:';

// リポジトリURL
var repoURL = 'https://github.com/nezumi650/StealthPosting';

// ボタン画像(背景透過)
var buttonSettingImgPath = 'https://github.com/nezumi650/StealthPosting/blob/master/iine.png';

// ボタン画像の縦横
var buttonSettingWidth  = 50;
var buttonSettingHeight = 25;

// ボタン画像の背景色
// @TODO もっとかっこよくエフェクトさせる
var buttonSettingColor        = 'white';
var buttonSettingColorClicked = 'yellow';


/********************************************
  *** ミニアバター画像設定
  ********************************************/

// ミニアバター画像の縦横
var avatarSettingWidth  = 25;
var avatarSettingHeight = 25;

// ミニアバター画像表示部の文言
var avatarSettingDefaultInnerHTML = '<span style="font-size: 1px; color: #cccccc;">Got IINE from :</span> '



/********************************************
  *** 実処理
  ********************************************/
// イシュー自体にイイネボタン追加
// addIINEButtonIssue(); @TODO あとで

// コメントにイイネボタン追加
addIINEButtonComments();

// ミニアバターの追加、イイネコメントのhide
var allIINEComments = getAllIINEComments();
addIINEIcon(allIINEComments);
hideAllIINEComments(allIINEComments);





/********************************************
  *** 関数群
  ********************************************/

/**
  * いいねボタン自体を作成
  */
function createIINEButton() {
  // ボタンを用意
  var IINEImg      = document.createElement('img');
  IINEImg.width  = buttonSettingWidth;
  IINEImg.height = buttonSettingHeight;
  IINEImg.style.backgroundColor = buttonSettingColor;
  IINEImg.src      = buttonSettingImgPath;

  return IINEImg;
}

/**
  * issue 自体にいいねボタン追加
  * @TODO これまだ使ってない
  */
function addIINEButtonIssue() {
  // ボタンを用意
  var IINEImg = createIINEButton();
  // クリックされた時のイベントを用意
  IINEImg.addEventListener('click', postNiceIssue, false);

  // ボタンを配置する場所を用意
  var element = document.createElement('p');
  element.style.textAlign='right';
  // 配置
  element.appendChild(IINEImg);

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
  changeYellow(buttonImgElm);
  postComment('This issue');
  // いいねボタンを白色に戻す
  setTimeout( function(){changeDefault(buttonImgElm)}, 300);
};

/**
  * コメントにいいねボタン追加
  */
function addIINEButtonComments() {
  var commentElms = document.querySelectorAll( '[id^="issuecomment-"]' );

  for (var i = 0; i < commentElms.length; i++) {
    var commentHeaderElm = commentElms[i].querySelector('.comment-header-date');
    var element = document.createElement('span');

    element.dataset.issueCommentId = commentElms[i].id;

    var IINEImg = createIINEButton();
    element.addEventListener('click', postNice, false);

    element.appendChild(IINEImg);
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
  changeYellow(buttonImgElm);
  postComment(issueCommentId);
  // いいねボタンを白色に戻す
  setTimeout( function(){changeDefault(buttonImgElm)}, 300);
};

/**
  * いいねボタンの色の変更
  */
function changeYellow(imgElm) {
  imgElm.style.backgroundColor = 'yellow';
}
function changeDefault(imgElm) {
  imgElm.style.backgroundColor = 'white';
}

/**
  * いいねコメントの一覧を、いいね元のコメントid毎に取得
  */
function getAllIINEComments() {
  var discussionBubbles = document.querySelectorAll('.discussion-bubble');
  var IINEComments = {}; //空のオブジェクト
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
      if (!IINEComments[originalCommentId]) {
        IINEComments[originalCommentId] = []; //空の配列
      }
      IINEComments[originalCommentId].push(discussionBubble);
    }
  }
  return IINEComments;
}

/**
  * いいねコメントを非表示にする
  */
function hideAllIINEComments(discussionBubblesAllArray) {
  for (var parentId in discussionBubblesAllArray){
    var discussionBubblesArray = discussionBubblesAllArray[parentId];
    for (var i = 0; i < discussionBubblesArray.length; i++) {
      discussionBubblesArray[i].style.display='none';
    }
  }
}

/**
  * いいねコメントを削除する
  * @TODO 実装
  */
function deleteIINEComment() {
  var commentId = this.getAttribute('for');
}


/**
  * いいねした人のアイコンを小さく表示する
  */
function addIINEIcon(discussionBubblesAllArray) {

  for (var parentId in discussionBubblesAllArray){
    if (parentId == 'issue') {
      //@TODO
    } else {
      var parentElm = document.getElementById(parentId);
    }

    // アイコンを表示する場所を用意
    var avatarArea = parentElm.querySelector('.avatarArea');
    if (avatarArea) {
      // すでにあれば、一回中身を削除
      avatarArea.innerHTML = avatarSettingDefaultInnerHTML;
    } else {
      // まだ無ければ作成
      avatarArea = document.createElement('p');
      avatarArea.style.textAlign='right';
      avatarArea.className='avatarArea';
      avatarArea.innerHTML=avatarSettingDefaultInnerHTML;
      // HTMLに入れ込む
      parentElm.appendChild(avatarArea);
    }

    var discussionBubblesArray = discussionBubblesAllArray[parentId];
    for (var i = 0; i < discussionBubblesArray.length; i++) {
      var commentId = discussionBubblesArray[i].querySelector('[id^="issuecomment-"]').getAttribute('id');
      var avatarImgElm = discussionBubblesArray[i].querySelector('.discussion-bubble-avatar');
      // 小さいアバター画像を作成
      var addAvatarImg      = document.createElement('img');
      addAvatarImg.width  = avatarSettingWidth;
      addAvatarImg.height = avatarSettingHeight;
//      addAvatarImg.onclick = deleteIINEComment; @TODO アイコンクリックでイイネコメント削除
      addAvatarImg.src      = avatarImgElm.getAttribute('src');
      addAvatarImg.setAttribute('for', commentId);

      // 小さいアバター画像をHTMLに入れ込む
      avatarArea.appendChild(addAvatarImg);
    }
  }
}





// ----------------

// コメントを引数で受け取ってポスト

function postComment(target) {
  // フォームにコメントを挿入
  var commentForm = document.querySelector( '[id^="comment_body_"]' );
  commentForm.value = '<p class="IINEComment"> ' + target + ' ' + customComment + ' ' + '<br />' + defaultMessage + repoURL + '</p>';

  var submitButton = document.querySelector('.form-actions:last-child button[type="submit"]:last-child');
  var mouseEvents = document.createEvent("MouseEvents");
  mouseEvents.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  submitButton.dispatchEvent( mouseEvents );

  // ちょっと待たないと書き込み終わってなくてhideできないので苦肉の対応
  // @TODO もうちょっとかっこ良くしたい。。。。
  setTimeout( function(){
    var allIINEComments = getAllIINEComments();
    addIINEIcon(allIINEComments);
    hideAllIINEComments(allIINEComments);
  }, 800);
}










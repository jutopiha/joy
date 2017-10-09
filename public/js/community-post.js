var doc = document;
window.addEventListener("DOMContetnLoaded", function(){
  var postid = data[0].postId;
  var userid = data[0].userId;
  var title = data[0].title;
  var time = data[0].currentTime;
  var content = data[0].content;
  var image = data[0].image;
  var category = data[0].category;

  var html;

  var titleDiv = doc.createElement("div");
  titleDiv.className = 'posted_title';
  var h3Div = doc.createElement("h3");
  h3Div.innerHTML = title;
  titleDiv.appendChild(h3Div);

  var categoryDiv = doc.createElement("div");
  categoryDiv.className = 'posted_category';
  var spanDiv = doc.createElement("span");
  spanDiv.innerHTML = category;
  categoryDiv.appendChild(spanDiv);

  var userDiv = doc.createElement("div");
  userDiv.className = 'posted_user';
  spanDiv = doc.createElement("span");
  spanDiv.innerHTML = '작성자: '+userid;
  userDiv.appendChild(spanDiv);

  var picDiv = doc.createElement("div");
  userDiv.className = 'posted_pic';

  var contentDiv = doc.createElement("div");
  userDiv.className = 'posted_content';
  contentDiv.innerHTML=content;

  var timeDiv = doc.createElement("div");
  userDiv.className = 'posted_time';
  spanDiv = doc.createElement("span");
  timeDiv.appendChild(spanDiv);
  var pDiv = doc.createElement("p");
  pDiv.innerHTML = time;
  timeDiv.appendChild(pDiv);

  doc.getElementsByClassName('post_box').appendChild(titleDiv);
  doc.getElementsByClassName('post_box').appendChild(categoryDiv);
  doc.getElementsByClassName('post_box').appendChild(userDiv);
  doc.getElementsByClassName('post_box').appendChild(picDiv);
  doc.getElementsByClassName('post_box').appendChild(contentDiv);
  doc.getElementsByClassName('post_box').appendChild(timeDiv);


  divTag = doc.createElement("div");
  divTag.className = 'post_buttons';

  var rewriteBtnTag = doc.createElement("form");
  rewriteBtnTag.className = 'rewrite_btn';
  rewriteBtnTag.setAttribute('action', '/community/post-rewrite?postid=' + postid);
  rewriteBtnTag.setAttribute('method', 'GET');

  var rewrite_btn = doc.createElement("button");
  rewrite_btn.setAttribute('type', 'submit');
  html = '수정하기';
  rewrite_btn.innerHTML = html;

  rewriteBtnTag.appendChild(rewrite_btn);

  var deleteBtnTag = doc.createElement("form");
  deleteBtnTag.className = 'delete_btn';
  deleteBtnTag.setAttribute('action', '/community/post-delete?postid=' + postid);
  deleteBtnTag.setAttribute('method', 'DELETE');

  var delete_btn = doc.createElement("button");
  delete_btn.setAttribute('type', 'submit');
  html = '수정하기';
  delete_btn.innerHTML = html;

  deleteBtnTag.appendChild(delete_btn);

  divTag.appendChild(rewriteBtnTag);
  divTag.appendChild(deleteBtnTag);

  doc.getElementsByClassName('container').appendChild(divTag);

  data.forEach(function(data, i){
    if (i == 0)
      return true;

    var html;
    var commentid = data.commentId;
    var userid = data.userId;
    var time = data.currentTime;
    var content = data.content;

    var cmtDiv = doc.createElement("div");
    cmtDiv.className = 'cmt '+ userid ;

    var spanDiv = doc.createElement("span");
    spanDiv.innerHTML = userid;
    cmtDiv.appendChild(spanDiv);

    spanDiv = doc.createElement("span");
    spanDiv.innerHTML = time;
    cmtDiv.appendChild(spanDiv);

    var formTag = doc.createElement("form");
    formTag.setAttribute('action', 'community/comment-delete?postid='+data[0].postId+'&commentid='+cmt_id);
    formTag.setAttribute('method', 'DELETE');

    var buttonTag = doc.createElement("button");
    buttonTag.setAttribute('type', 'submit');
    html ='삭제';
    buttonTag.innerHTML = html;

    formTag.appendChild(buttonTag);
    cmtDiv.appendChild(formTag);

    buttonTag = doc.createElement("button");
    buttonTag.className = 'comment-rewrite cmt_btn';
    buttonTag.setAttribute('onclick', "rewriteClick('"+ commentid +"')");
    html ='수정';
    buttonTag.innerHTML = html;

    cmtDiv.appendChild(buttonTag);

    var contentDiv = doc.createElement("div");
    contentDiv.className = 'comment_content';
    contentDiv.innerHTML = content;

    cmtDiv.appendChild(contentDiv);

    doc.getElementsByClassName("comments").appendChild(cmtDiv);

  });

});

// window.document.getElementsByClassName("comment-rewrite").onclick = function(){
//   var contents = doc.getElementsByClassName("comment_content").childNodes;
//   console.log(contents);
// };


//덧글 수정하기 버튼, 덧글 아이디를 파라미터로 받는다.
function rewriteClick(cmt_id) {
  var erase1, erase2, erase3, content;
  var parent = doc.getElementsByClassName(cmt_id)["0"];
  if(parent.lastChild.nodeName == '#text'){
  erase1 = parent.lastChild.previousSibling;
  erase2 = erase1.previousSibling.previousSibling;
  erase3 = erase2.previousSibling.previousSibling;
  content = erase1.innerText;
} else {
  erase1 = parent.lastChild;
  erase2 = erase1.previousSibling;
  erase3 = erase2.previousSibling;
  content = erase1.innerText;
}
  //내용 HTML remove
  parent.removeChild(erase3);
  parent.removeChild(erase2);
  parent.removeChild(erase1);

  var html = content;
  console.log(parent.lastChild);
  console.log(erase1);
  //수정하기 form 태그 붙이기
  var formTag = doc.createElement("form");
  formTag.setAttribute('action', '/community/comment-rewrite?postid='+data[0].postId+'&commentid='+cmt_id);
  formTag.setAttribute('method', '/PUT');
  //form textarea
  var textareaTag = doc.createElement("textarea");
  textareaTag.setAttribute('cols', 90);
  textareaTag.setAttribute('rows', 3);
  textareaTag.innerHTML = html;
  //form rewrite button
  var rewrite_buttonTag = doc.createElement("button");
  rewrite_buttonTag.className = 'rewrite-btn';
  rewrite_buttonTag.setAttribute('type', 'submit');
  html = "수정";
  rewrite_buttonTag.innerHTML= html;
  //form cancel button
  var cancel_buttonTag = doc.createElement("div");
  cancel_buttonTag.className = 'cancel-btn';
  cancel_buttonTag.setAttribute('onclick', "cancelRewrite('" + cmt_id + "')");
  html = "취소";
  cancel_buttonTag.innerHTML= html;

  formTag.appendChild(textareaTag);
  formTag.appendChild(cancel_buttonTag);
  formTag.appendChild(rewrite_buttonTag);


  parent.appendChild(formTag);

  //parent.removeChild(parent.lastChild);
//  console.log(erase2);


}

function cancelRewrite(cmt_id) {
  var parent = doc.getElementsByClassName(cmt_id)["0"];
  var erase = parent.lastChild;
//  var erase1 = parent.lastChild.previousSibling;

  //form 태그 삭제
  parent.removeChild(erase);

  var html;
  //전 상태로 되돌리기
  var deleteFormTag = doc.createElement("form");
  deleteFormTag.className = 'cmt_delete';
  deleteFormTag.setAttribute('action', "community/comment-delete?postid="+data[0].postId+"&commentid="+cmt_id);
  deleteFormTag.setAttribute('method', 'DELETE');

  var deleteBtnTag = doc.createElement("button");
  deleteBtnTag.className = 'cmt_btn';
  deleteBtnTag.setAttribute('type', 'submit');
  html = '삭제';
  deleteBtnTag.innerHTML = html;

  deleteFormTag.appendChild(deleteBtnTag);

  var rewriteBtnTag = doc.createElement("button");
  rewriteBtnTag.className = 'comment-rewrite cmt_btn';
  rewriteBtnTag.setAttribute('onclick', "rewriteClick('" + cmt_id+ "')");
  html = '수정';
  rewriteBtnTag.innerHTML = html;

  var divTag = doc.createElement("div");
  divTag.className = "comment_content";
  divTag.innerHTML = erase.childNodes[0].innerHTML;

  parent.appendChild(deleteFormTag);
  parent.appendChild(rewriteBtnTag);
  parent.appendChild(divTag);



  console.log(erase.childNodes[0].innerHTML);
}

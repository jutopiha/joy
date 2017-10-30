var doc = document;
doc.addEventListener("DOMContentLoaded", function(){
  //post에 대한 정보 가져오기
console.log(data[0]);
console.log(data);
  var postNum = data[0];
  //innerHTML
  var html;
  var org_category = data[1][0].category
//ppst 생성
  //post 제목

  //글 작성란 생성
  var tlkDiv = doc.createElement("div");
  tlkDiv.className = 'talk_wrt_section';

  var tlkForm = doc.createElement("form");
  tlkForm.className = 'talk_form';
  
  if(org_category =='다짐톡')
	  tlkForm.setAttribute('action', '/community/joy-fighting/write-complete');
  else
	 tlkForm.setAttribute('action', '/community/joy-hello/write-complete');
  tlkForm.setAttribute('method', 'POST');

  var tlkwrtDiv = doc.createElement("div");
  tlkwrtDiv.className = 'tlk_wrt';

  var tlkTextarea = doc.createElement("textarea");
  tlkTextarea.setAttribute('rows', '9');
  tlkTextarea.setAttribute('name', 'content');
  if(org_category == '다짐톡')
    tlkTextarea.setAttribute('placeholder', '오늘 하루의 다짐을 적어주세요!');
  else
    tlkTextarea.setAttribute('placeholder', '모두에게 자신을 소개해주세요!');
  tlkTextarea.required = true;

  var tlkwrtbtnDiv = doc.createElement("div");
  tlkwrtbtnDiv.className = 'tlk_wrt_btn';
    var tlkwrtbtn = doc.createElement("button");
    tlkwrtbtn.setAttribute('type', 'submit');
    html = 'SUBMIT';
    tlkwrtbtn.innerHTML = html;
  tlkwrtbtnDiv.appendChild(tlkwrtbtn);

  tlkwrtDiv.appendChild(tlkTextarea);
  tlkwrtDiv.appendChild(tlkwrtbtnDiv);
  tlkForm.appendChild(tlkwrtDiv);
  tlkDiv.appendChild(tlkForm);

  console.log(doc.getElementsByClassName('talk_box'));
  doc.getElementsByClassName("talk_box")[0].appendChild(tlkDiv);

  //글 목록 생성
  var talksDiv = doc.createElement("div");
  talksDiv.className = 'talks';

	console.log(data);

  data[1].forEach(function(data, i){
	console.log(data);
	var tlk_id = data.postId;
	var tlk_content = data.content;
	var tlk_time = data.createdTime;
	var tlk_userid = data.userId;
	console.log(tlk_id);

	var tlkidDiv = doc.createElement("div");
	tlkidDiv.id = tlk_id;
	tlkidDiv.className = 'tlk';

	var spanDiv = doc.createElement("span");
	spanDiv.innerHTML = tlk_userid;
	tlkidDiv.appendChild(spanDiv);

	spanDiv = doc.createElement("span");
	spanDiv.innerHTML = tlk_time;
	tlkidDiv.appendChild(spanDiv);

	var tlkidForm = doc.createElement("form");
	tlkidForm.className = 'tlk_delete';
	if(org_category == '다짐톡')
		tlkidForm.setAttribute('action', '/community/joy-fighting/delete?postid='+tlk_id);
	else
		tlkidForm.setAttribute('action','/community/joy-hello/delete?postid='+tlk_id);
	tlkidForm.setAttribute('method', 'POST');

	var tlkformBtn = doc.createElement("button");
	tlkformBtn.className = 'tlk_btn';
	tlkformBtn.setAttribute('type','submit');
	html = '삭제';
	tlkformBtn.innerHTML = html;
	tlkidForm.appendChild(tlkformBtn);

	tlkidDiv.appendChild(tlkidForm);

	//talk-rewrite button
	var tlkrwBtn = doc.createElement("button");
	tlkrwBtn.className = 'tlk_btn talk-rewrite';
	tlkrwBtn.setAttribute('onClick', 'talk_rewriteClick('+tlk_id+",'"+org_category+"')");
	html = '수정';
	tlkrwBtn.innerHTML = html;

	tlkidDiv.appendChild(tlkrwBtn);

	//tlk_content
	var tlkContentDiv = doc.createElement("div");
	tlkContentDiv.className = 'tlk_content';
	tlkContentDiv.innerHTML = tlk_content;

	tlkidDiv.appendChild(tlkContentDiv);

	//open_btn
	var openBtn = doc.createElement("span");
	openBtn.className = 'open_btn';
	openBtn.setAttribute('onClick','openComment('+tlk_id+",'"+org_category+"')");
	html = '덧글 보기';
	openBtn.innerHTML = html;
	
	tlkidDiv.appendChild(openBtn);

    talksDiv.appendChild(tlkidDiv);	
  });
	
  doc.getElementsByClassName("talk_box")[0].appendChild(talksDiv);

  if((postNum % 9) == 0) {
    if(postNum == 0)
        return;
  var moreDiv = doc.createElement("div");
  moreDiv.className = 'moreDiv';
  var moreForm = doc.createElement("form");
  moreForm.className = 'moreForm';
  if(org_category == '다짐톡')
      moreForm.setAttribute('action', '/community/joy-fighting?postNum='+postNum);
  else
      moreForm.setAttribute('action', '/community/joy-hello?postNum='+postNum);
  moreForm.setAttribute('method', 'POST');

  var moreBtn = doc.createElement("button");
  moreBtn.className = 'moreBtn';
  moreBtn.setAttribute('type', 'submit');
  html = 'MORE';
  moreBtn.innerHTML = html;

  moreForm.appendChild(moreBtn);
  moreDiv.appendChild(moreForm);

  doc.getElementsByClassName('container')[0].appendChild(moreDiv);
  }


});

function talk_rewriteClick(tlk_id, org_category){
	var html;
	var contentTag = doc.getElementById(tlk_id).getElementsByClassName('tlk_content')[0];
	console.log(contentTag);
	var content = contentTag.innerText;
	console.log(content);

	contentTag.innerHTML = '';

	var rwFormTag = doc.createElement("form");
	rwFormTag.className = 'tlk_rewrite';
	if(org_category == '다짐톡')
		rwFormTag.setAttribute('action', '/community/joy-fighting/rewrite-complete?postid='+tlk_id);
	else
		rwFormTag.setAttribute('action', '/community/joy-hello/rewrite-complete?postid='+tlk_id);
	rwFormTag.setAttribute('method', 'POST');
	
	var rwTextArea = doc.createElement("textarea");	
	rwTextArea.setAttribute('cols','90');
	rwTextArea.setAttribute('rows','5');
	rwTextArea.setAttribute('name','content');
	
rwTextArea.required = true;
	rwTextArea.innerText = content;

	rwFormTag.appendChild(rwTextArea);

	var rwBtn = doc.createElement("button");
	rwBtn.className = 'rwBtn';
	rwBtn.setAttribute('type', 'submit');
	html = '수정';
	rwBtn.innerHTML = html;
	
	rwFormTag.appendChild(rwBtn);

	rwBtn = doc.createElement("div");
	rwBtn.className = 'rwBtn';
	rwBtn.setAttribute('onClick','talk_rewriteCancleClick('+tlk_id+",'"+org_category+"')");
	html = '쥐소';
	rwBtn.innerHTML = html;

	rwFormTag.appendChild(rwBtn);

	contentTag.appendChild(rwFormTag);

	var moreBtn = doc.createElement("form");
	moreBtn.setAttribute('action', '/community/joy-fighting?postNum=');
	
}

function talk_rewriteCancleClick(tlk_id){
	var html;
	var contentTag = doc.getElementById(tlk_id).getElementsByClassName('tlk_content')[0];	
	var content = contentTag.getElementsByTagName("textarea")[0].innerHTML;
	console.log(contentTag);
	console.log(content);	
	contentTag.innerHTML = '';
	contentTag.innerText = content;
}

function cmtrewriteClick(tlk_id, cmt_id, org_category){
	var html;
	var contentTag = doc.getElementById(tlk_id).getElementsByClassName(cmt_id)[0].getElementsByClassName("comment_content")[0];
	var content = contentTag.innerText;
	console.log(contentTag);
	console.log(content);

	contentTag.innerText = '';

	var cmtFormTag = doc.createElement("form");
    cmtFormTag.className = 'cmt_rewrite';
	if(org_category == '다짐톡')
	    cmtFormTag.setAttribute('action', '/community/joy-fighting/comment-rewrite?commentid='+cmt_id);
    else
		cmtFormTag.setAttribute('action', '/community/joy-hello/comment-rewrite?commentid='+cmt_id);
	cmtFormTag.setAttribute('method', 'POST');

    var cmtTextArea = doc.createElement("textarea");
    cmtTextArea.setAttribute('cols','85');
    cmtTextArea.setAttribute('rows','3');
    cmtTextArea.setAttribute('name','content');
    cmtTextArea.required = true;
    cmtTextArea.innerText = content;

    cmtFormTag.appendChild(cmtTextArea);

    var cmtBtn = doc.createElement("button");
    cmtBtn.className = 'cmtBtn';
    cmtBtn.setAttribute('type', 'submit');
    html = '수정';
    cmtBtn.innerHTML = html;

    cmtFormTag.appendChild(cmtBtn);

    cmtBtn = doc.createElement("div");
    cmtBtn.className = 'cmtBtn';
    cmtBtn.setAttribute('onClick','cmtrewriteCancleClick('+tlk_id+','+cmt_id+')');
    html = '쥐소';
    cmtBtn.innerHTML = html;

    cmtFormTag.appendChild(cmtBtn);

    contentTag.appendChild(cmtFormTag); 
}

function cmtrewriteCancleClick(tlk_id, cmt_id){
	 var html;
    var contentTag = doc.getElementById(tlk_id).getElementsByClassName(cmt_id)[0].getElementsByClassName('comment_content')[0];
    var content = contentTag.getElementsByTagName("textarea")[0].innerHTML;
    console.log(contentTag);
    console.log(content);
    contentTag.innerHTML = '';
    contentTag.innerText = content;

}

function openComment(tlk_id, org_category){
	
	var opened = doc.getElementById(tlk_id).getElementsByTagName("span")[2].innerText;
	console.log(opened);
	if(opened == '덧글 보기'){
	var html = '덧글 숨기기';
	console.log('들어옴');
	doc.getElementById(tlk_id).getElementsByTagName("span")[2].innerHTML = html; 
	var tlkComments = doc.createElement("div");
    tlkComments.className = 'tlk_comments';

	var cmtForm = doc.createElement("form");
	if(org_category == '다짐톡')
		cmtForm.setAttribute('action', '/community/joy-fighting/comment-write?postid='+tlk_id);
	else 
		cmtForm.setAttribute('action', '/community/joy-hello/comment-write?postid='+tlk_id);
	cmtForm.setAttribute('method', 'POST');
	cmtForm.className = 'tlk_cmt_form';
	
	var cmtText = doc.createElement("textarea");
	cmtText.setAttribute('rows', '4');
	cmtText.setAttribute('cols', '93');
	cmtText.setAttribute('name', 'content');
	cmtText.setAttribute('placholder', '덧글을 작성해주세요');
	cmtText.required = true;
	cmtForm.appendChild(cmtText);

	var cmtButton = doc.createElement("button");
	cmtButton.setAttribute('type', 'submit');
	html = 'SUBMIT';
	cmtButton.innerHTML = html;
	cmtForm.appendChild(cmtButton);

	tlkComments.appendChild(cmtForm);



	data[2].forEach(function(data, i){
		var cmt_id = data.commentId;
		var cmt_content = data.content;
		var cmt_time = data.createdTime;
		var cmt_userid = data.userId;
		var cmt_postid = data.postId;

		if(cmt_postid == tlk_id){
		var cmtDiv = doc.createElement("div");
		cmtDiv.className = 'cmt '+cmt_id;
		
		var spanDiv = doc.createElement("span");
		spanDiv.innerHTML = cmt_id;
		
		cmtDiv.appendChild(spanDiv);

		spanDiv = doc.createElement("span");
		spanDiv.innerHTML = cmt_time;

		cmtDiv.appendChild(spanDiv);

		//form
		var cmtForm = doc.createElement("form");
		cmtForm.className = 'cmt_delete';
		if(org_category == '다짐톡')
			cmtForm.setAttribute('action', '/community/joy-fighting/comment-delete?commentid='+cmt_id);
		else
			cmtForm.setAttribute('action', '/community/joy-hello/comment-delete?commentid='+cmt_id);
		cmtForm.setAttribute('method', 'POST');

		//form_button
		var formBtn = doc.createElement("button");
		formBtn.className = 'cmt_btn';
		formBtn.setAttribute('type', 'submit');
		html = '삭제';
		formBtn.innerHTML = html;
		cmtForm.appendChild(formBtn);

		cmtDiv.appendChild(cmtForm);

		//rewrite_button
		var rwBtn = doc.createElement("button");
		rwBtn.className='comment-rewrite cmt_btn';
		rwBtn.setAttribute('onClick', 'cmtrewriteClick('+tlk_id+','+cmt_id+",'"+org_category+"')");
		html = '수정';
		rwBtn.innerHTML = html;

		cmtDiv.appendChild(rwBtn);

		//cmment_content
		var contentDiv = doc.createElement("div");
		contentDiv.className = 'comment_content';
		contentDiv.innerHTML = cmt_content;

		cmtDiv.appendChild(contentDiv);

		tlkComments.appendChild(cmtDiv);						
	} else 
		return;
		//console.log(cmt_postid);	
		//console.log(doc.getElementById(cmt_postid));	

	});
	
		 doc.getElementById(tlk_id).appendChild(tlkComments);
	} else {
		html = '덧글 보기';
		doc.getElementById(tlk_id).getElementsByTagName("span")[2].innerHTML = html;
		var cmtRemove = doc.getElementById(tlk_id).getElementsByClassName('tlk_comments')[0];
		cmtRemove.parentNode.removeChild(cmtRemove);
	}	
}

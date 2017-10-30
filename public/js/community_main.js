var doc = document;
//페이지가 로드될때 실행되는 함수
window.addEventListener("DOMContentLoaded", function(){
  //포스트 데이터 가져오기
//  var posts = response.data;
  var postNum = post[0];
  console.log(post[0]);
  console.log(post[1]);

  var html;

  post[1].forEach(function(post){
    //서버에서 가져온 데이터
    var postid = post.postId;
    var userId = post.userId;
    var title = post.title;
    var time = post.currentTime;
    var content = post.content;
    var image = post.image;

    //ejs 사용해서 가져오기

    var aLink = doc.createElement("a");
    aLink.setAttribute('href', '/community/post?postid='+postid);

    var box = doc.createElement("div");
    box.className = 'box';

    //post_title
    var titleDiv = doc.createElement("div");
    titleDiv.className = 'post_title';
    html = "<h3>" + title + "</h3>";
    titleDiv.innerHTML = html;

    //post_pic
    var picDiv = doc.createElement("div");
    picDiv.className = 'post_pic';

    //post_content
    var contentDiv = doc.createElement("div");
    contentDiv.className = 'post_content';
    contentDiv.innerHTML = content;

    //post_time
    var dateDiv = doc.createElement("div");
    dateDiv.className = 'post_date';
    html = '<span>작성일</span><p>'+ time +'</p>';
    dateDiv.innerHTML = html;

    box.appendChild(titleDiv);
    box.appendChild(picDiv);
    box.appendChild(contentDiv);
    box.appendChild(dateDiv);

    aLink.appendChild(box);

    doc.getElementsByClassName('container')[0].appendChild(aLink);
  });

  var category = post[1][0].category;
  if((postNum % 9) == 0) {
	if(postNum == 0)
		return;
  var moreDiv = doc.createElement("div");
  moreDiv.className = 'moreDiv';

  var moreForm = doc.createElement("form");
  moreForm.className = 'moreForm';
  if(category == '금융지식팁')
	  moreForm.setAttribute('action', '/community?postNum='+postNum);
  else
	  moreForm.setAttribute('action', '/community/joy-free?postNum='+postNum);
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

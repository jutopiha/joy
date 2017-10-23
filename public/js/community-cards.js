var doc = document;
doc.addEventListener("DOMContentLoaded", function(){
  //post에 대한 정보 가져오기
  var postid = data[0].postid;
  var userid = data[0].userId;
  var title = data[0].title;
  var time = data[0].currentTime;
  var content = data[0].content;
  var image = data[0].image;
  var category = data[0].category;

  //innerHTML
  var html;

//ppst 생성
  //post 제목

  //글 작성란 생성
  var tlkDiv = doc.createElement("div");
  tlkDiv.className = 'talk_wrt_section';

  var tlkForm = doc.createElement("form");
  tlkForm.className = 'talk_form';
  tlkForm.setAttribute('action', '/community/joy-fighting/write-complete');
  tlkForm.setAttribute('method', 'POST');

  var tlkwrtDiv = doc.createElement("div");
  tlkwrtDiv.className = 'tlk_wrt';

  var tlkTextarea = doc.createElement("textarea");
  tlkTextarea.setAttribute('rows', '9');
  if(category == '다짐톡')
    tlkTextarea.setAttribute('placeholder', '오늘 하루의 다짐을 적어주세요!');
  else if(category == '소개톡')
    tlkTextarea.setAttribute('placeholder', '모두에게 자신을 소개해주세요!');
  tlkTextarea.required = true;

  var tlkwrtbtnDiv = doc.createElement("div");
  tlkwrtbtnDiv.className = 'tlk_wrt_btn';
    var tlkwrtbtn = doc.createElement("button");
    tlkwrtbtn.setAttribute('type', 'submit');
    html = 'SUBMIT';
    tlkwrtbtn.innserHTML = html;
  tlkwrtbtnDiv.appendChild(tlkwrtbtn);

  tlkwrtDiv.appendChild(tlkTextarea);
  tlkwrtDiv.appendChild(tlkwrtbtnDiv);
  tlkForm.appendChild(tlkwrtDiv);
  tlkDiv.appendChild(tlkForm);

  doc.getElementsByClassName("talk_box").appendChild(tlkDiv);

  //글 목록 생성
  var talksDiv = doc.createElement("div");
  talksDiv.className = 'talks';

//  data[1].forEach(function(data), i)

});

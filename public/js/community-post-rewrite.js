var doc = document;

window.addEventListener("DOMContentLoaded", function(){
  var title = data[0].title;
  var category = data[0].category;
  var content = data[0].content;
  var userid = data[0].userId;
  var postid = data[0].postId;
  var time = data[0].currentTime;
  var image = data[0].image;

  var html;
  var parent = doc.getElementById("frm");
  console.log(parent);
  console.log(parent[0]);
  parent.setAttribute('action', '/community/post-rewrite-complete?postid='+postid);
console.log(parent[0].getElementsByTagName("option"));
console.log(category);
  if(category == '금융지식팁'){
	parent[0].getElementsByTagName("option")[1].selected = true;
  } else if(category == '자유게시판'){
	parent[0].getElementsByTagName("option")[2].selected = true;
  }

  console.log(parent[1]);
  console.log(parent[2]);
  console.log(parent[3]);
  parent[1].value = title;

  parent[2].innerHTML = content;

  parent[3].innerHTML = image;

});

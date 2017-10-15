var doc = document;

window.addEventListener("DOMContentLoaded", function(){
  var title = data.title;
  var category = data.category;
  var content = data.content;
  var userid = data.userId;
  var postid = data.postId;
  var time = data.currentTime;
  var image = data.image;

  var html;
  var parent = doc.getElementsById("frm");
  console.log(parent);
  console.log(parent[0]);
  doc.getElementsById("frm")[0].setAttribute('action', '/community/post-rewrite-complete?postid='+postid);


});

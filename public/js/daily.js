var doc = document;
window.addEventListener("DOMContentLoaded", function(){
  var html;
  var year = JSON.stringify(data[0]).substr(0,4);
  var month = JSON.stringify(data[0]).substr(4,2);
  var day = JSON.stringify(data[0]).substr(6,2);
  var totalIncome=data[1][0].totalIncome;
  var totalExpense=data[2][0].totalExpense;

	console.log(data[1]);
	console.log(data[1][0]);

  //날짜
  html = year + '년 ' + month + '월 ' + day + '일';
  doc.getElementsByClassName("daily_box")[0].getElementsByClassName("title")[0].innerHTML = html;
  var incomeBox = doc.getElementById('daily_income');
  //총 수입 금액
  html = '총 수입 ' + totalIncome + '원';
  incomeBox.getElementsByClassName('table-title')[0].innerHTML = html;

  //수입 내역들
  data[3].forEach(function(data, i){

    var aTag = doc.createElement('a');
    aTag.setAttribute('href', "/statistic/web/detail?incomeid=" + data.incomeId);

    var liTag = doc.createElement('li');
    html = '<i class="fa fa-plus"></i>' + data.money + '<span class="daily_category">' + data.category + '</span>';
    liTag.innerHTML = html;

    aTag.appendChild(liTag);

    incomeBox.getElementsByClassName('table-list')[0].appendChild(aTag);
  });


  var expenseBox = doc.getElementById('daily_expense');
  //총 지출 금액
  html = '총 지출 ' + totalExpense + '원';
  expenseBox.getElementsByClassName('table-title')[0].innerHTML = html;
	console.log(html);
  //지출 내역들
  data[4].forEach(function(data, i){

    var aTag = doc.createElement('a');
    aTag.setAttribute('href', "/statistic/web/detail?expenseid=" + data.expenseId);

    var liTag = doc.createElement('li');
    html = '<i class="fa fa-minus"></i>' + data.money + '<span class="daily_category">' + data.category + '</span>';
    liTag.innerHTML = html;

    aTag.appendChild(liTag);

    expenseBox.getElementsByClassName('table-list')[0].appendChild(aTag);
  });

  doc.getElementsByClassName("daily_box")[0].appendChild(incomeBox);
  doc.getElementsByClassName("daily_box")[0].appendChild(expenseBox);

});

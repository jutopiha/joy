var doc = document;
window.addEventListener("DOMContentLoaded", function(){
  var html;
  var totalIncome=data[0][0].totalIncome;
  var totalExpense=data[1][0].totalExpense;

	console.log(data[1]);
	console.log(data[1][0]);

  //날짜
  doc.getElementsByClassName("daily_box")[0].getElementsByClassName("title")[0];
  var incomeBox = doc.getElementById('daily_income');
  //총 수입 금액
  html = '총 수입 ' + totalIncome + '원';
  incomeBox.getElementsByClassName('table-title')[0].innerHTML = html;

  //수입 내역들
  data[2].forEach(function(data, i){

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
  data[3].forEach(function(data, i){

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

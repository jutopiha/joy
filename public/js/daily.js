var doc = document;
window.addEventListener("DOMContentLoaded", function(){
  var html;
  var totalIncome;
  var totalExpense;

  //날짜
  doc.getElementsByClassName("daily_box").getElementsByClassName("title");

  var incomeBox = doc.getElementById('daily_income');
  //총 수입 금액
  html = '총 수입' + totalIncome + '원';
  incomeBox.getElementsByClassName('table-title').innerHTML = html;

  //수입 내역들
  data[1].forEach(function(data, i){

    var aTag = doc.createElement('a');
    aTag.setAttribute('href', "/statistic/web/detail?incomeid=" + data.incomeId);

    var liTag = doc.createElement('li');
    html = '<i class="fa fa-plus"></i>' + data.money + '<span class="daily_category">' + data.category + '</span>';
    liTage.innerHTML = html;

    aTag.appendChild(liTag);

    incomeBox.getElementsByClassName('table-list').appendChild(aTag);
  });


  var expenseBox = doc.getElementById('daily_expense');
  //총 지출 금액
  html = '총 지출' + totalExpense + '원';
  expenseBox.getElementsByClassName('table-title').innerHTML = html;

  //지출 내역들
  data[2].forEach(function(data, i){

    var aTag = doc.createElement('a');
    aTag.setAttribute('href', "/statistic/web/detail?expenseid=" + data.expenseId);

    var liTag = doc.createElement('li');
    html = '<i class="fa fa-minus"></i>' + data.money + '<span class="daily_category">' + data.category + '</span>';
    liTage.innerHTML = html;

    aTag.appendChild(liTag);

    expenseBox.getElementsByClassName('table-list').appendChild(aTag);
  });

  doc.getElementsByClassName("daily_box").appendChild(incomeBox);
  doc.getElementsByClassName("daily_box").appendChild(expenseBox);

});

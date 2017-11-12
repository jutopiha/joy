var doc = document;
window.addEventListener("DOMContentLoaded", function(){
	if(data[0].category){
	 console.log( doc.getElementsByClassName('detail_btn')[0].getElementsByTagName('button'));
	 doc.getElementsByClassName('detail_btn')[0].getElementsByTagName('button')[0].getElementsByTagName('a')[0].setAttribute('href', '/statistic/web/detail-rewrite?incomeid='+data[0].incomeId);
	 doc.getElementsByClassName('detail_btn')[0].getElementsByTagName('button')[1].getElementsByTagName('a')[0].setAttribute('href', '/statistic/web/detail-delete?incomeid='+data[0].incomeId);
	}
	else if(data[0].expenseId) {
	 doc.getElementsByClassName('detail_btn')[0].getElementsByTagName('button')[0].getElementsByTagName('a')[0].setAttribute('href', '/statistic/web/detail-rewrite?expenseid='+data[0].expenseId);
	 doc.getElementsByClassName('detail_btn')[0].getElementsByTagName('button')[1].getElementsByTagName('a')[0].setAttribute('href', '/statistic/web/detail-delete?expenseid='+data[0].expenseId);
	}
	
});

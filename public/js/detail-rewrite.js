var doc = document;
window.addEventListener("DOMContentLoaded", function(){

	var year;
	var month;
	var day;
	var hour;
	var min;

	

	console.log(JSON.stringify(data[0]));	
	year = JSON.stringify(data[0].date).substr(0,4);
	month = JSON.stringify(data[0].date).substr(4,2);
	day = JSON.stringify(data[0].date).substr(6,2);

	if(JSON.stringify(data[0].time).length<4){
		hour = "00";
		min = JSON.stringify(data[0].time);
	} else {
		hour = JSON.stringify(data[0].time).substr(0,2);
		min = JSON.stringify(data[0].time).substr(2,2);
	}
	console.log(hour);
	console.log(min);
		
  	if(data[0].incomeId){
		doc.getElementsByClassName('input_form')[0].getElementsByTagName('form')[0].setAttribute('action', '/post/detail-rewrite?incomeid='+data[0].incomeId);
		doc.getElementsByClassName('input_form')[0].getElementsByTagName('form')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0].setAttribute('value', year+'-'+month+'-'+day);
		doc.getElementsByClassName('input_form')[0].getElementsByTagName('form')[0].getElementsByTagName('div')[1].getElementsByTagName('input')[0].setAttribute('value', hour+':'+min);
	} else if(data[0].expenseId){
		doc.getElementsByClassName('input_form')[0].getElementsByTagName('form')[0].setAttribute('action', '/post/detail-rewrite?expenseid='+data[0].expenseId);
        doc.getElementsByClassName('input_form')[0].getElementsByTagName('form')[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0].setAttribute('value', year+'-'+month+'-'+day);
        doc.getElementsByClassName('input_form')[0].getElementsByTagName('form')[0].getElementsByTagName('div')[1].getElementsByTagName('input')[0].setAttribute('value', hour+':'+min);
	}
});

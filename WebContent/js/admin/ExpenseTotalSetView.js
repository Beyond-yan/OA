Ext.ns('ExpenseTotalSetView');

var ExpenseTotalSetView=function(){

	
	
	var expenseAccountPersonal2View=new ExpenseAccountPersonal2View();
	var expenseAccountCompany2View=new ExpenseAccountCompany2View();



 var myTabPanel = new Ext.TabPanel
    ({	
	     activeTab: 0,
		 items: 
		 [
		 	{
		        title: '个人费用报销维护',
		        height:500,
				items: [expenseAccountPersonal2View]
		    },
			{
		       title: '公司费用报销维护',
		       height:500,		       
		       items: [expenseAccountCompany2View]
		    }
		 ]
   });

	var panel = new Ext.Panel
	({
		title : '费用报销状态维护',
		iconCls : "menu-personal-phoneBook",
		layout : 'form',
		id : 'ExpenseTotalSetView',
		height : 800,
		items : [myTabPanel]
	});

	return panel;	

}
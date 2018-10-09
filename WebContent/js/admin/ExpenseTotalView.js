Ext.ns('ExpenseTotalView');

var ExpenseTotalView=function(){

	
	
	var expenseAccountPersonalView=new ExpenseAccountPersonalView();
	var expenseAccountCompanyView=new ExpenseAccountCompanyView();



 var myTabPanel = new Ext.TabPanel
    ({	
	     activeTab: 0,
		 items: 
		 [
		 	{
		        title: '个人费用报销',
		        height:500,
				items: [expenseAccountPersonalView]
		    },
			{
		       title: '公司费用报销',
		       height:500,		       
		       items: [expenseAccountCompanyView]
		    }
		 ]
   });

	var panel = new Ext.Panel
	({
		title : '费用报销申请管理',
		iconCls : "menu-personal-phoneBook",
		layout : 'form',
		id : 'MyExpenseTotalView',
		height : 800,
		items : [myTabPanel]
	});

	return panel;	

}
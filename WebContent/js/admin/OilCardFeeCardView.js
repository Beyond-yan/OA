Ext.ns("OilCardFeeCardView");


var OilCardFeeCardView =  function() 
{
	var carOilCardView = new CarOilCardView();
	var carPassFeeCardView = new CarPassFeeCardView();
    var myTabPanel = new Ext.TabPanel
    ({	
	     activeTab: 0,	     
		 items: 
		 [
		 	{
		        title: '油卡',
		        height:750,
				items: [carOilCardView]
		    },
			{
		       title: '粤通卡',
		       height:750,		       
		       items: [carPassFeeCardView]
		    }
		 ]
   });

	var panel = new Ext.Panel
	({
		title : '油卡/粤通卡管理',
		iconCls : "menu-personal-phoneBook",
		layout : 'form',
		id : 'MyOilCardFeeCardView',
		height : 800,
		items : [myTabPanel]
	});

	return panel;	
}
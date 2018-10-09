var ArchMeetingApply = Ext.extend(Ext.Panel,{
	constructor:function(config){
		Ext.applyIf(this,config);
		ArchMeetingApply.superclass.constructor.call(this,{
			id:'ArchMeetingApply',
			title:'ArchMeetingApply',
			items:[]
		});
		window.setTimeout(function(){
			var tabs = Ext.getCmp('centerTabPanel');
			tabs.remove(tabs.getItem('ArchMeetingApply'));
			ProDefinitionView.newFlow(flowMap.get("archMeetingFlow"),FlowDefIdPro.OfficeMeetingFlowName);
		},100);
	}
});


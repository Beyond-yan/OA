var MeetingRecord = Ext.extend(Ext.Panel,{
	constructor:function(config){
		Ext.applyIf(this,config);
		MeetingRecord.superclass.constructor.call(this,{
			id:'MeetingRecord',
			title:'MeetingRecord',
			items:[]
		});
		window.setTimeout(function(){
			var tabs = Ext.getCmp('centerTabPanel');
			tabs.remove(tabs.getItem('MeetingRecord'));
			ProDefinitionView.newFlow(flowMap.get("outConferenceFlow"),FlowDefIdPro.MeetingRecordFlowName);
		},100);
	}
});


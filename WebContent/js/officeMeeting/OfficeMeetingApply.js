var OfficeMeetingApply = Ext.extend(Ext.Panel,{
	constructor:function(config){
		Ext.applyIf(this,config);
		OfficeMeetingApply.superclass.constructor.call(this,{
			id:'OfficeMeetingApply',
			title:'OfficeMeetingApply',
			items:[]
		});
		window.setTimeout(function(){
			var tabs = Ext.getCmp('centerTabPanel');
			tabs.remove(tabs.getItem('OfficeMeetingApply'));
			ProDefinitionView.newFlow(flowMap.get("officeMeetingFlow"),FlowDefIdPro.OfficeMeetingFlowName);
		},100);
	}
});


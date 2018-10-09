var ToReceiveArchFlowView = function(archivesId) {
	var formPanel = new Ext.FormPanel({
		layout : 'form',
		id : 'ToReceiveArchFlowView',
		bodyStyle : 'padding:5px;',
		items : [{
					xtype : 'container',
					layout : 'column',
					style : 'padding:0px 0px 8px 0px;margin-left:10px;',
					defaults : {
						allowBlank : false,
						border : false
					},
					items : [{
								xtype:'hidden',
								name:'archivesId',
								value:archivesId
							},{
								text : '稿笺名称',
								style:'padding-top:4px;',
								width: 65,
								xtype : 'label'
							},{
								width : 280,
								id : 'ArchivesRecAllSearchForm.sentStoredDefId',
								xtype : 'combo',
								hiddenName : 'defId',
								editable : false,
								triggerAction : 'all',
								displayField : 'name',
								valueField : 'id',
								store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/flow/comQuickProDefinition.do?typeId=1205687',
									fields : ['id', 'name']
								})/*,
								listeners: {
									'select':function(combo){
										
										 var contentPanel = App.getContentPanel();
										 var defId=combo.getValue();
										 var defName=combo.getRawValue();
										 Ext.Ajax.request({
												url : __ctxPath + '/system/receiveSysDataTransfer.do',
												params : {
													'dataId' : archivesId
												},
												method:'post',
												success : function(response, options) {
													var archivesnewid = Ext.util.JSON.decode(response.responseText).archivesId;
													 var startForm = contentPanel.getItem('ProcessRunStart' + defId);
													 Ext.getCmp('ToReceiveArchFlowViewWin').close();
													 Ext.getCmp('ToReceiveArchivesDetailView').close();
													 if (startForm == null) {
														startForm = new ProcessRunStart({
																	id : 'ProcessRunStart' + defId,
																	defId : defId,
																	archivesId :archivesnewid,
																	flowName : defName
																});
														 contentPanel.add(startForm);
													 }
													 contentPanel.activate(startForm);
												}
												});
										
									}
								}*/
							}]
			}]
	});
	var window = new Ext.Window({
		id : 'ToReceiveArchFlowViewWin',
		title : '交委收文处理笺',
		iconCls : 'menu-archive-draft',
		width : 400,
		height : 120,
		modal : true,
		layout : 'fit',
		border : false,
		buttonAlign : 'center',
		items : [ formPanel ],
		buttons : [{
			text : '确定',
			iconCls : 'btn-save',
			handler : function() {
				 var contentPanel = App.getContentPanel();
				 var defId=Ext.getCmp("ArchivesRecAllSearchForm.sentStoredDefId").getValue();//combo.getValue();
				 var defName=Ext.getCmp("ArchivesRecAllSearchForm.sentStoredDefId").getRawValue();//combo.getRawValue();
				 Ext.Ajax.request({
					 url : __ctxPath + '/system/verfitySysDataTransfer.do',
					 params : {
						 'dataId' : archivesId
					 },
					 method:'post',
					 success : function(response, options) {
						 var message=Ext.util.JSON.decode(response.responseText).message;
						 Ext.Msg.confirm('信息确认', message+'您确认要进行收文登记吗？', function(btn) {
							 if (btn == 'yes') {
								 Ext.Ajax.request({
									url : __ctxPath + '/system/receiveSysDataTransfer.do',
									params : {
										'dataId' : archivesId,
										'defId' : defId,
										'defName': defName
									},
									method:'post',
									success : function(response, options) {
										 var archivesnewid = Ext.util.JSON.decode(response.responseText).archivesId;
										 var startForm = contentPanel.getItem('ProcessRunStart' + defId);
										 Ext.getCmp('ToReceiveArchFlowViewWin').close();
										 Ext.getCmp('ToReceiveArchivesDetailView').close();
										 if (startForm == null) {
											startForm = new ProcessRunStart({
														id : 'ProcessRunStart' + defId,
														defId : defId,
														archivesId :archivesnewid,
														flowName : defName
													});
											 contentPanel.add(startForm);
										 }
										 contentPanel.activate(startForm);
									}
								});
							}
						});
					 }
				 });
			}
		}, {
			text : '关闭',
			iconCls : 'btn-close',
			handler : function() {
				window.close();
			}
		} ]
	});
	window.show();
};

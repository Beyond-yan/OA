MessageForm = Ext.extend(Ext.Panel, {
	formPanel : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		MessageForm.superclass.constructor.call(this, {
					id : 'MessageForm',
					layout : 'form',
					border : false,
					items : [this.formPanel]
				});
	},// end of constructor
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel({
			id : 'mFormPanel',
			title : '发送信息',
			iconCls : 'btn-sendM',
			border : true,
			draggable:true,
			width : 560,
			height : 320,
			style : 'margin-top:5%;margin-left:15%;',
			defaultType : 'textarea',
			url : __ctxPath + '/info/sendShortMessage.do',
			method : 'post',
			reader : new Ext.data.JsonReader({
						root : 'data',
						id : 'messageId'
					}, [{
								name : 'userId',
								mapping : 'senderId'
							}, {
								name : 'userFullname',
								mapping : 'sender'
							}]),
			defaults : {
				allowBlank : false,
				selectOnFocus : true,
				msgTarget : 'side'
			},		
			layout : 'form',
			buttonAlign : 'center',
			bodyStyle:'padding:5px',
			items : [{
						xtype : 'hidden',
						name : 'userId',
						id : 'userId'
					},
					{
									fieldLabel:'发送人',
									anchor:'60%',
									xtype:'combo',
									triggerAction:'all',
									editable:false,
									value:curUserInfo.fullname,
									displayField:'grantFullname',
									valueField:'grantUId',
									hiddenName:'senderId',
									store:new Ext.data.JsonStore({
										autoLoad:true,
										root : 'result',
										url:__ctxPath+'/system/agentAppUser.do?isCombo=true&userId='+curUserInfo.userId,
										fields:[
											'grantUId',
											'grantFullname'
										]
									})
								},
								{
									xtype:'compositefield',
									fieldLabel:'收信人',
									items:[
										{
											xtype : 'textarea',
											name : 'userFullname',
											id : 'userFullname',
											allowBlank : false,
											readOnly : true,
											width : 290,
											height : 50
										},{
											xtype : 'container',
											border : false,
											width : 100,
											items:[
												{
													xtype : 'button',
													iconCls : 'btn-mail_recipient',
													text : '添加联系人 ',
													width : 80,
													handler : function() {
														UserSelector
																.getView(
																		function(userIds,
																				fullnames) {
																			var userId = Ext.getCmp('userId');
																			var userFullname = Ext.getCmp('userFullname');
																			if (userId.getValue() != ''&& userFullname.getValue() != '') {
																				var stId = (userId.getValue() + ',').concat(userIds);
																				var stName = (userFullname.getValue() + ',').concat(fullnames);
																				var ids = uniqueArray(stId.split(','));
																				var names = uniqueArray(stName.split(','));
																				userId.setValue(ids.toString());
																				userFullname.setValue(names.toString());
																			} else {
																				userId.setValue(userIds);
																				userFullname.setValue(fullnames);
																			}
			
																		}).show();
													}
												}, {
													xtype : 'button',
													text : '清除联系人',
													iconCls : 'btn-del',
													width : 80,
													handler : function() {
														var name = Ext.getCmp('userFullname');
														var id = Ext.getCmp('userId');
														name.reset();
														id.reset();
													}
												}	
											]// end of container items
											
										}
									]
								},
								 {
									fieldLabel:'内容',
									id : 'sendContent',
									xtype : 'textarea',
									name : 'content',
									width : 380,
									height:120,
									autoScroll:true,
									allowBlank : false
								}],
			buttons : [{
						text : '发送',
						iconCls : 'btn-mail_send',
						handler :this.send
					}, {
						text : '重置',
						iconCls : 'reset',
						handler :this.reset
					}]
		});

	},//end of initUIComponents
	send:function(){
	    var message = Ext.getCmp('mFormPanel');
		if (message.getForm().isValid()) {
			message.getForm().submit({
						waitMsg : '正在 发送信息',
						success : function(message, o) {
							var message = Ext.getCmp('mFormPanel');
							Ext.ux.Toast.msg('操作信息','信息发送成功！');
							message.getForm().reset();
						}
					});
		}
	},
	reset:function(){
	   var message = Ext.getCmp('mFormPanel');
	   message.getForm().reset();
	}
});

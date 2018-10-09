var DutySignForm = function() {
	var fp = this.setup();
	var window = new Ext.Window({
				id : 'DutySignFormWin',
				iconCls:'menu-signInOff',
				title : '签到、签退',
				width : 500,
				height : 160,
				modal : true,
				layout : 'fit',
				buttonAlign : 'center',
				items : [this.setup()],
				buttons : [{
					text : '保存',
					iconCls : 'btn-save',
					handler : function() {
						var fp = Ext.getCmp('DutySignForm');
						if (fp.getForm().isValid()) {
							fp.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									Ext.getCmp('DutySignGrid').getStore().reload();
									window.close();
								},
								failure : function(fp, action) {
									Ext.MessageBox.show({
												title : '操作信息',
												msg : '信息保存出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
									});
									window.close();
								}
							});
						}
					}
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : function() {
						window.close();
					}
				}]
			});
	window.show();
};

DutySignForm.prototype.setup = function() {
	var formPanel = new Ext.FormPanel({
				url : __ctxPath + '/duty/saveDutySignRecord.do',
				layout : 'form',
				id : 'DutySignForm',
				border : false,
				bodyStyle : 'padding:5px;',
				defaults : {
					width : 400,
					anchor : '98%,98%'
				},
				formId : 'DutySignFormId',
				defaultType : 'textfield',
				items : [{
							fieldLabel : '签到时间',
							name : 'dutySignRecord.signDate',
							xtype:'datetimefield',
							format:'Y-m-d H:i',
							value: new Date(),
							editable:false,
							allowBlank: false
						},{
							xtype : 'container',
							layout : 'column',
							style:'padding-top:5px',
							defaultType : 'textfield',
							items : [{
										xtype : 'label',
										text : '值班人:',
										width : 105
									}, {
										name : 'dutySignRecord.appUser.fullname',
										id : 'fullname',
										xtype:'textfield',
										allowBlank: false,
										readOnly:true,
										value : curUserInfo.fullname,
										width:286
									}, {
										xtype:'hidden',
										name:'dutySignRecord.appUser.userId',
										id:'userId',
										value : curUserInfo.userId
									},{
										xtype : 'button',
										text : '选择人员',
										id:'userSelect',
										iconCls : 'btn-select',
										width : 80,
										handler : function() {
											UserSelector.getView(
												function(ids, names) {
												  var fullname = Ext.getCmp('fullname');
												  var userId = Ext.getCmp('userId');
												  fullname.setValue(names);
												  userId.setValue(ids);
												},true).show();
										}
									}]
						}
				]
			});
	return formPanel;

};

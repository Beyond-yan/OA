AgainCarApplyForm = Ext.extend(Ext.Window, {
	// 构造函数 - 开始
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件

		this.initUIComponents();
		AgainCarApplyForm.superclass.constructor.call(this, {
					id : 'AgainCarApplyForm',
					layout : 'form',
					items : [this.formPanel],
					modal : true,
					height : 150,
					iconCls : 'menu-archive-draft',
					width : 600,
					maximizable : true,
					title : '重新派车',
					buttonAlign : 'center',
					buttons : [{
								text : '保存',
								iconCls : 'btn-save',
								scope : this,
								handler : this.save
							}, {
								text : '取消',
								iconCls : 'btn-cancel',
								scope : this,
								handler : function() {
									Ext.getCmp('AgainCarApplyForm').close();
								}}
							]
				});
	},// 构造函数 - 结束

	// 初始化界面控件 - 开始
	initUIComponents : function() {
		var start=this.starttime+":00";
		var end=this.endtime+":00";
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			id : 'AgainCarApplyFormPanel',
			frame : false,
			border : true,
			defaults : {
				width : 400,
				anchor : '98%,98%'
			},
			bodyStyle : 'padding-top:5px;padding-left:5px;',
			formId : 'AgainCarApplyFormIdMy',
			defaultType : 'textfield',
			items : [ {
						name : 'carApply.applyId',
						id : 'AgainCarApplyFormPanel.applyId',
						xtype : 'hidden',
						value : this.applyId == null ? '' : this.applyId
					}, {
						name : 'carApply.userId',
						id : 'AgainCarApplyFormPanel.userId',
						xtype : 'hidden'
					}, {
				xtype : 'hidden',
				id : 'carIds',
				name : 'carApply.carIds'
			}, {
				xtype : 'container',
				layout : 'column',
				id:'AgainCarApplyFormPanel.checkCar',
				style : 'padding-left:0px;margin-bottom:4px;',
				items : [
					{
							xtype : 'label',
							style : 'padding-left:0px;',
							text : '车牌号码:',
							width : 105
						}, {
							xtype : 'textfield',
							name : 'carApply.carNo',
							id : 'carNo',
							editable : false,
						    allowBlank : false,
							readOnly : true,
							width : 220
						}, {
							xtype : 'button',
							iconCls : 'btn-car',
							text : '选择车辆',
							handler : function() {
								
								CarUseSelector.getView(
							function(id,name) {
									Ext.getCmp('carNo').setValue(name);
								    Ext.getCmp('carIds').setValue(id);
								},true,Date.parseDate(start,'Y-m-d h:i:s'),Date.parseDate(end,'Y-m-d h:i:s')).show();
							}
						}, {
							xtype : 'button',
							text : '清除记录',
							iconCls : 'reset',
							handler : function() {
								Ext.getCmp('carNo')
										.setValue('');
								Ext.getCmp('carIds')
										.setValue('');
							}
						},{
							xtype : 'button',
							text : '车况参考',
							iconCls : 'btn-car',
							handler : function() {
								CarReferSelector.getView().show();
							}
						}]
			},{
				xtype : 'hidden',
				id : 'driverIds',
				name : 'carApply.driverIds'
			}, {
				xtype : 'container',
				layout : 'column',
				id : 'checkDriver',
				style : 'padding-left:0px;margin-bottom:4px;',
				items : [{
							xtype : 'label',
							style : 'padding-left:0px;',
							text : '司机:',
							width : 105
						}, {
							xtype : 'textfield',
							name : 'carApply.driver',
							id : 'driver',
							editable : false,
							allowBlank : false,
							readOnly : true,
							width : 220
						}, {
							xtype : 'button',
							iconCls : 'btn-car',
							text : '选择司机',
							handler : function() {
								CarDriverSelector.getView(
										function(id, name) {
											Ext
													.getCmp('driver')
													.setValue(name);
											Ext
													.getCmp('driverIds')
													.setValue(id);
										}, true,Date.parseDate(start,'Y-m-d h:i:s'),Date.parseDate(end,'Y-m-d h:i:s')).show();
							}
						}, {
							xtype : 'button',
							text : '清除记录',
							iconCls : 'reset',
							handler : function() {
								Ext.getCmp('driver')
										.setValue('');
                                      }
						     }]},  {   
                    id:'AgainCarApplyFormPanel.myGroup',   
                    xtype: 'checkboxgroup',   
                    fieldLabel: '提醒办理人',      
                    items: [   
                        {boxLabel: '发送邮件', name: 'sendMail', checked: true},   
                        {boxLabel: '发送短信', name: 'sendMsg', checked: true},
                         {boxLabel: '即时消息', name: 'sendInfo', checked: true}]   }]
		});
		 if (this.applyId != null && this.applyId != 'undefined') {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/admin/getCarApply.do?applyId='
						+ this.applyId,
				waitMsg : '正在载入数据...',
				success : function(form, action) {
					var result = action.result.data;
					Ext.getCmp('AgainCarApplyFormPanel.userId').setValue(result.userId)
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('编辑', '载入失败');
				}
			});
		};
		 // end of the load formPanel
	},// 初始化界面控件 - 结束

	// 保存并启动申请流程 - 开始
	save : function() {
		   var fp = Ext.getCmp('AgainCarApplyFormPanel');
		   var carNo = fp.getCmpByName('carApply.carNo').getValue();
	       var driver = fp.getCmpByName('carApply.driver').getValue();
	       var content = "您在OA系统发起的用车申请已通过审核并派车，车牌号："+carNo+"司机："+driver;
	       var sendMail = fp.getCmpByName('sendMail').getValue();
	  	   var sendMsg = fp.getCmpByName('sendMsg').getValue();
	       var sendInfo = fp.getCmpByName('sendInfo').getValue();
	       var userId=fp.getCmpByName('carApply.userId').getValue();
		if (fp.getForm().isValid()) {
			var defId = this.defId;
			fp.getForm().submit({
				url : __ctxPath + '/admin/saveCarFlowCarApply.do',
				params : {
				},
				method : 'post',
				waitMsg : '正在提交数据...',
				success : function(fp, action) {
											Ext.Ajax.request({
							url : __ctxPath + "/flow/sendMailNoticecarProcessActivity.do",
								params : {
										  userId: userId,
										  content:content,
										  sendMail : sendMail,
					                      sendMsg : sendMsg,
					                      sendInfo:sendInfo
										  },
								method : 'POST'
							});
				 Ext.ux.Toast.msg('提示','修改成功！');
				Ext.getCmp('AgainCarApplyForm').close();
				Ext.getCmp('CarApplyEditForm').close();
				Ext.getCmp('VehicleUsingAssignGrid').getStore().reload();	
				},
				failure : function(fp, action) {
					Ext.MessageBox.show({
								title : '操作信息',
								msg : '信息保存出错，请联系管理员！',
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});

					
				}
			});
		}
	}

})
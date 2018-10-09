var AppointmentForm = function(appointId) {
	this.appointId = appointId;
	var fp = this.setup();
	var win = new Ext.Window( {
		id : 'AppointmentFormWin',
		iconCls : 'menu-appointment',
		title : '约会详细信息',
		width : 500,
		height : 430,
		modal : true,
		layout : 'fit',
		buttonAlign : 'center',
		items : [ this.setup() ],
		buttons : [ {
			text : '保存',
			iconCls : 'btn-save',
			handler : function() {
				var fp = Ext.getCmp('AppointmentForm');
				if (fp.getForm().isValid()) {
					fp.getForm().submit( {
						method : 'post',
						waitMsg : '正在提交数据...',
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '成功保存信息！');
							Ext.getCmp('AppointmentGrid').getStore().reload();
							win.close();
						},
						failure : function(fp, action) {
							Ext.MessageBox.show( {
								title : '操作信息',
								msg : '信息保存出错，请联系管理员！',
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});
							win.close();
						}
					});
				}
			}
		}, {
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
};

AppointmentForm.prototype.setup = function() {

	var formPanel = new Ext.FormPanel( {
		url : __ctxPath + '/task/saveAppointment.do',
		layout : 'form',
		id : 'AppointmentForm',
		frame : false,
		border : false,
		formId : 'AppointmentFormId',
		bodyStyle : 'padding:5px;',
		defaultType : 'textfield',
		defaults : {
			width : 300
		},
		items : [ {
			name : 'appointment.appointId',
			id : 'appointId',
			xtype : 'hidden',
			value : this.appointId == null ? '' : this.appointId
		}, {
			fieldLabel : '主题',
			allowBlank : false,
			name : 'appointment.subject'
		}, {
			fieldLabel : '开始时间',
			name : 'appointment.startTime',
			allowBlank : false,
			xtype : 'datetimefield',
			format : 'Y-m-d H:i:s'
		}, {
			fieldLabel : '结束时间',
			name : 'appointment.endTime',
			allowBlank : false,
			xtype : 'datetimefield',
			format : 'Y-m-d H:i:s'
		}, {
			fieldLabel : '约会内容',
			name : 'appointment.content',
			xtype : 'textarea',
			allowBlank : false
		}, {
			fieldLabel : '地点',
			name : 'appointment.location',
			allowBlank : false
		}, {
			fieldLabel : '备注',
			name : 'appointment.notes',
			xtype : 'textarea'
		}, {
			fieldLabel : '受邀人Email',
			xtype : 'textarea',
			name : 'appointment.inviteEmails'
		}
		, {
			xtype : 'checkboxgroup',
			//name : 'appointment.isMsgOrMobile',
			fieldLabel : '留言方式',
			items : [ {
				xtype : 'checkbox',
				boxLabel : '普通留言',
				name : 'appointment.isMsg',
				id:'isMsg',
				inputValue : 0
			}, {
				xtype : 'checkbox',
				boxLabel : '手机留言',
				name : 'appointment.isMobile',
				id:'isMobile',
				inputValue : 0
			} ]
		} 
		]
	});

	if (this.appointId != null && this.appointId != 'undefined') {
		formPanel.loadData(
				{
					deferredRender : false,
					url : __ctxPath + '/task/getAppointment.do?appointId='
							+ this.appointId,
					waitMsg : '正在载入数据...',
					preName:'appointment',
					root:'data',
					success : function(response,options) {
						var res = Ext.util.JSON.decode(response.responseText).data;
						if(res.isMsg==0){
							var megField= Ext.getCmp('isMsg');
							megField.setValue(true);
						}
						if(res.isMobile==0){
						    var isMobileField=Ext.getCmp('isMobile');
						    isMobileField.setValue(true);
						}
					},
					failure : function(response,options) {
						Ext.ux.Toast.msg('编辑', '载入失败');
					}
				});
	}
	return formPanel;

};

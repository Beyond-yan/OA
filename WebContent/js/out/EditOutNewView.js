var EditOutNewView= function() {
	
	var formPanel=this.setup();
	
	var formPanelBottom = this.setupbottom();
	
	//var toolbar = this.initToolbar();
	var topPanel = new Ext.Panel({
		layout:'fit',
		iconCls : 'menu-holiday',
		id : 'EditOutNewplanForm',
		title :'外出登记',
		autoScroll:true,
		items:[formPanel,formPanelBottom]
	});
	
	return topPanel;
};
EditOutNewView.prototype.setupbottom = function(){
	var formPanelBottom = new Ext.FormPanel({
		height : 30,
		frame : false,border:false,
		id : 'NewOutPlanSaveForm',
		layout : 'hbox',
		layoutConfig: {
            padding:'0',
            align:'middle'
        },
		defaults : {
			xtype : 'label',
			margins:{top:0, right:4, bottom:4, left:10}
		},		
		items : [{
					xtype : 'button',
					text : '保存',
					iconCls : 'btn-save',
					style:'margin-left:32%;',
					handler : function() {
						var userform = Ext.getCmp('EditOutNewForm');
						var startTime = Ext.util.Format.date(Ext.getCmp("EditOutNewInfo.startDate")
											.getValue(), 'Y-m-d H:i');
						var endTime = Ext.util.Format.date(
									Ext.getCmp("EditOutNewInfo.endDate").getValue(), 'Y-m-d H:i');
						if (startTime >=endTime) {
								Ext.MessageBox.show({
											title : '操作信息',
											msg : '外出日期应小于返回日期！',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});
								return;
							}
							var af=false;
							Ext.Ajax.request({
							url : __ctxPath + '/Out/isofficeDeputyDirectorOut.do?outPerson.appUser.userId='+Ext.getCmp('EditOutNewInfo.userId').getValue(),
								method:'post',
								success : function(response, options) {
								 af=Ext.util.JSON.decode(response.responseText).success;
							if(af==true){	
						    var emailContent=userform.getCmpByName('outPerson.appUser.fullname').getValue()+'将于'+startTime+'至'+endTime+'外出，外出事由为： '
						    +userform.getCmpByName('outPerson.outReson').getValue()+';\n工作托付为：'+userform.getCmpByName('outPerson.workConsign').getValue();
							new emailForm(emailContent,function(comments){
						 	Ext.getCmp('comments').setValue(comments);
						   userform.getForm().submit({
									waitMsg : '正在提交用户信息',
									success : function(userform, o) {
										Ext.ux.Toast.msg('操作信息', '保存成功！')
										var contentPanel = Ext.getCmp('centerTabPanel');
										contentPanel.remove('EditOutNewplanForm');
										App.clickTopTab('OutPersonView');
										if(Ext.getCmp('OutPersonGrid'))
										Ext.getCmp('OutPersonGrid').getStore()
												.reload();
									}
								});})}
								else {		
								userform.getForm().submit({
									waitMsg : '正在提交用户信息',
									success : function(userform, o) {
										Ext.ux.Toast.msg('操作信息', '保存成功！')
										var contentPanel = Ext.getCmp('centerTabPanel');
										contentPanel.remove('EditOutNewplanForm');
										App.clickTopTab('OutPersonView');
										if(Ext.getCmp('OutPersonGrid'))
										Ext.getCmp('OutPersonGrid').getStore()
												.reload();
									}
								});}
								},
								failure : function(form, action) {
				                Ext.ux.Toast.msg('编辑', '载入失败');
								}
							});
					}
				}, {
					xtype : 'button',
					text : '取消',
					iconCls : 'btn-reseted',
					style:'margin-left:35%;',
					handler : function() {
						 Ext.getCmp('centerTabPanel').remove('EditOutNewplanForm');
					}
				}]
			});
	return formPanelBottom;
};

EditOutNewView.prototype.setup = function() {
	var formPanel = new Ext.FormPanel({
		url : __ctxPath + '/Out/saveOut.do',
		autoHeight:true,
		frame:false,
		border:false,
		layout : 'column',
		id:'EditOutNewForm',
		bodyStyle : 'padding-left:12%;padding-bottom:20px;',		
		formId : 'EditOutNewViewId',
		items : [{
			xtype : 'panel',
			frame : false,
			autoWidth : true,
			autoHeight : true,
			border : true,
			layout : 'table',
			bodyStyle : "margin-top:20px;margin-left: 9%; background-color: transparent;",
			items : [{
				xtype : "panel",
				id : 'EditOutNewInfo',
				width : 700,
				height : 350,
				title : "外出登记",
				layout : 'form',
				textAlign : 'center',
				defaultType : "textfield",
				defaults : {
					width : 500
				},
				labelWidth : 55,
				labelAlign : "right",
				hideLabels : false,
				items : [{
						xtype : 'container',
						id : 'SentArchiveDepCheck.signDep',
						layout : 'column',
						style : 'padding-left:0px;margin-top:10px;',
						height : 30,
						width : 560,
						defaults : {
							border : false
						},
						items : [{
									xtype : 'label',
									width : 63,
									style : 'padding-left:3px;margin-top:5px;',
									text : '外出人员：'
								}, {
									id : 'EditOutNewInfo.fullname',
									name : 'outPerson.appUser.fullname',
									value : curUserInfo.fullname,
									xtype : 'textfield',
									width : 415,
									height : 25,
									allowBlank : false,
									readOnly : true
								}, {
									id : 'EditOutNewInfo.userId',
									name : 'outPerson.appUser.userId',
									value : curUserInfo.userId,
									xtype : 'hidden'
								},  {
							   xtype : 'button',
							   text : '请选择',
							   width : 40,
							   style : 'padding-left:5px',
							   iconCls : 'btn-user-sel',
							   handler : function() {
								NewUserSelector.getView(
										function(userId, fullName, depName) {
											Ext
													.getCmp('EditOutNewInfo.department')
													.setValue(depName);
											Ext
													.getCmp('EditOutNewInfo.userId')
													.setValue(userId);
											Ext
													.getCmp('EditOutNewInfo.fullname')
													.setValue(fullName);
										}, true,false,!curUserInfo.isAdmin).show();
									}
								}]
					},{
							fieldLabel : '所在部门',
							id : 'EditOutNewInfo.department',
							style:'margin-left:2px;',
							editable : false,
                                                        value:curUserInfo.depName
						}, {
							fieldLabel : '外出日期',
							name : 'outPerson.startDate',
							style:'margin-left:2px;',
							format : 'Y-m-d H',
							id : 'EditOutNewInfo.startDate',
							editable : false,
							minValue : new Date(),
							xtype : 'datetimefield',
							allowBlank : false
						}, {
							fieldLabel : '返回日期',
							xtype : 'datetimefield',
							style:'margin-left:2px;',
							format : 'Y-m-d H',
							name : 'outPerson.endDate',
							id : 'EditOutNewInfo.endDate',
							editable : false,
							minValue : new Date(),
							allowBlank : false,
							triggerAction : 'all'
						}, {
							fieldLabel : '外出事由',
							xtype : 'textarea',
							style:'margin-left:2px;',
							name : 'outPerson.outReson',
						    maxLength :100, 
							allowBlank : false
						}, {
							fieldLabel : '工作托付',
							xtype : 'textarea',
							style:'margin-left:2px;',
							name : 'outPerson.workConsign',
							maxLength :250,
							allowBlank : false
						}, {
					xtype : 'hidden',
					name : 'comment',
					id : 'comments'
				}]
			}]
		}]
		}
	);
if(curUserInfo.depId=='1247027'){
		Ext.Ajax.request({
			url : __ctxPath + '/leave/getDepNameLeaveArchives.do',
			params : {
			},
			method : 'post',
			success : function(response, options) {
				var data = Ext.util.JSON.decode(response.responseText);
				Ext.getCmp('EditOutNewInfo.department').setValue(data.depName);
			}
		});}
	return formPanel;
};
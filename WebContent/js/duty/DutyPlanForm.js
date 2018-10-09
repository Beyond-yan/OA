DutyPlanForm  = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DutyPlanForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'DutyPlanFormWin',
					title : '值班安排',
					iconCls : 'menu-signInOff',
					width : 860,
					height : 400,
					autoScroll: true,
					items:this.formPanel,
					border : false,
					modal : true,
					plain : true,
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		//初始化form表单
		var planId=this.planId;
		this.formPanel = new Ext.FormPanel({
			url : __ctxPath + '/duty/saveDutyPlan.do',
				layout : 'form',
				id : 'DutyPlanForm',
				bodyStyle : 'padding:5px;',
				frame : false,
				items : [{
							xtype:'hidden',
							name:'dutyPlan.id',
							id:'dutyPlan.id'
						},{
							layout : 'form',
						    border: false,
							labelWidth:40,
							labelAlign:'left',
							items:[{
									xtype : 'datefield',
									fieldLabel:'时间',
									format:'Y-m-d',
									width: 150,
									minValue: new Date(),
									disabledDays: [0,2,3,4,5,6],
									name : 'dutyPlan.planDate',
									id:'dutyPlan.planDate',
									allowBlank: false,
									editable:false
							}]
						},{
							xtype : 'container',
							style : 'padding-top:3px;padding-left:40px;',
							layout : 'column',
							height:40,
							items : [{
								xtype : 'label',
								text : '周一   : 上午',
								width : 65
							}, {
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs0.appUser.fullname',
								width : 250,
								readOnly : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs0.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs0.Days',
								value:0
							},{
								xtype:'hidden',
								name:'dutyStaffs0.sectionId',
								value:1
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName,depName){
										var fm = Ext.getCmp("DutyPlanForm");
										fm.getCmpByName('dutyStaffs0.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs0.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							},{
								xtype : 'label',
								style : 'padding-left:10px;',
								text : '下午',
								width : 40
							},{
								xtype:'hidden',
								name:'dutyStaffs1.sectionId',
								value:2
							},{
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs1.appUser.fullname',
								width : 250,
								readOnly : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs1.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs1.Days',
								value:0
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName){
										var fm = Ext.getCmp("DutyPlanForm");
										fm.getCmpByName('dutyStaffs1.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs1.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							}]
						}, {
							xtype : 'container',
							style : 'padding-top:3px;padding-left:40px;',
							layout : 'column',
							height:40,
							items : [{
								xtype : 'label',
								text : '周二   : 上午',
								width : 65
							}, {
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs2.appUser.fullname',
								width : 250,
								readOnly : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs2.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs2.sectionId',
								value:1
							},{
								xtype:'hidden',
								name:'dutyStaffs2.Days',
								value:1
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName){
										var fm = Ext.getCmp("DutyPlanForm");
										fm.getCmpByName('dutyStaffs2.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs2.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							},{
								xtype : 'label',
								style : 'padding-left:10px;',
								text : '下午',
								width : 40
							},{
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs3.appUser.fullname',
								width : 250,
								readOnly : true,
								allowBlank : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs3.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs3.sectionId',
								value:2
							},
								{
								xtype:'hidden',
								name:'dutyStaffs3.Days',
								value:1
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName){
										var fm = Ext.getCmp("DutyPlanForm");
										fm.getCmpByName('dutyStaffs3.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs3.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							}]
						},{
							xtype : 'container',
							style : 'padding-top:3px;padding-left:40px;',
							layout : 'column',
							height:40,
							items : [{
								xtype : 'label',
								text : '周三   : 上午',
								width : 65
							}, {
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs4.appUser.fullname',
								width : 250,
								readOnly : true,
								allowBlank : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs4.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs4.sectionId',
								value:1
							},{
								xtype:'hidden',
								name:'dutyStaffs4.Days',
								value:2
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName,depName){
										var fm = Ext.getCmp("DutyPlanForm");
										fm.getCmpByName('dutyStaffs4.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs4.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							},{
								xtype : 'label',
								style : 'padding-left:10px;',
								text : '下午',
								width : 40
							},{
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs5.appUser.fullname',
								width : 250,
								readOnly : true,
								allowBlank : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs5.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs5.Days',
								value:2
							},{
								xtype:'hidden',
								name:'dutyStaffs5.sectionId',
								value:2
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName){
										var fm = Ext.getCmp("DutyPlanForm");
										fm.getCmpByName('dutyStaffs5.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs5.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							}]
						},{
							xtype : 'container',
							style : 'padding-top:3px;padding-left:40px;',
							layout : 'column',
							height:40,
							items : [{
								xtype : 'label',
								text : '周四   : 上午',
								width : 65
							}, {
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs6.appUser.fullname',
								width : 250,
								readOnly : true,
								allowBlank : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs6.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs6.sectionId',
								value: 1
							},{
								xtype:'hidden',
								name:'dutyStaffs6.Days',
								value:3
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName){
										var fm = Ext.getCmp("DutyPlanForm");
										fm.getCmpByName('dutyStaffs6.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs6.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							},{
								xtype : 'label',
								style : 'padding-left:10px;',
								text : '下午',
								width : 40
							},{
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs7.appUser.fullname',
								width : 250,
								readOnly : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs7.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs7.sectionId',
								value: 2
							},{
								xtype:'hidden',
								name:'dutyStaffs7.Days',
								value:3
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName){
										var fm = Ext.getCmp("DutyPlanForm");
										fm.getCmpByName('dutyStaffs7.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs7.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							}]
						},{
							xtype : 'container',
							style : 'padding-top:3px;padding-left:40px;',
							layout : 'column',
							height:40,
							items : [{
								xtype : 'label',
								text : '周五   : 上午',
								width : 65
							}, {
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs8.appUser.fullname',
								width : 250,
								readOnly : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs8.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs8.sectionId',
								value: 1
							},{
								xtype:'hidden',
								name:'dutyStaffs8.Days',
								value:4
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName){
										var fm = Ext.getCmp("DutyPlanFormWin");
										fm.getCmpByName('dutyStaffs8.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs8.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							},{
								xtype : 'label',
								style : 'padding-left:10px;',
								text : '下午',
								width : 40
							},{
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs9.appUser.fullname',
								width : 250,
								readOnly : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs9.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs9.sectionId',
								value: 2
							},{
								xtype:'hidden',
								name:'dutyStaffs9.Days',
								value:4
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName,depName){
										var fm = Ext.getCmp("DutyPlanForm");
										fm.getCmpByName('dutyStaffs9.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs9.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							}]
						},{
							xtype : 'container',
							style : 'padding-top:3px;padding-left:40px;',
							layout : 'column',
							height:40,
							items : [{
								xtype : 'label',
								text : '周六   : 上午',
								width : 65
							}, {
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs10.appUser.fullname',
								width : 250,
								readOnly : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs10.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs10.sectionId',
								value: 1
							},{
								xtype:'hidden',
								name:'dutyStaffs10.Days',
								value:5
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName){
										var fm = Ext.getCmp("DutyPlanForm");
										fm.getCmpByName('dutyStaffs10.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs10.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							},{
								xtype : 'label',
								style : 'padding-left:10px;',
								text : '下午',
								width : 40
							},{
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs11.appUser.fullname',
								width : 250,
								readOnly : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs11.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs11.sectionId',
								value: 2
							},{
								xtype:'hidden',
								name:'dutyStaffs11.Days',
								value:5
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName){
										var fm = Ext.getCmp("DutyPlanForm");
										fm.getCmpByName('dutyStaffs11.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs11.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							}]
						},{
							xtype : 'container',
							style : 'padding-top:3px;padding-left:40px;',
							layout : 'column',
							height:40,
							items : [{
								xtype : 'label',
								text : '周日   : 上午',
								width : 65
							}, {
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs12.appUser.fullname',
								width : 250,
								readOnly : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs12.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs12.sectionId',
								value: 1
							},{
								xtype:'hidden',
								name:'dutyStaffs12.Days',
								value:6
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName){
										var fm = Ext.getCmp("DutyPlanForm");
										fm.getCmpByName('dutyStaffs12.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs12.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							},{
								xtype : 'label',
								style : 'padding-left:10px;',
								text : '下午',
								width : 40
							},{
								xtype : 'textfield',
								editable : false,
								name : 'dutyStaffs13.appUser.fullname',
								width : 250,
								readOnly : true
							},{
								xtype : 'hidden',
								name : 'dutyStaffs13.appUser.userId'
							},{
								xtype:'hidden',
								name:'dutyStaffs13.sectionId',
								value: 2
							},{
								xtype:'hidden',
								name:'dutyStaffs13.Days',
								value:6
							},{
								xtype : 'button',
								text : '请选择',
								iconCls : 'menu-person',
								handler : function() {
									UserSelector.getView(function(userId, fullName){
										var fm = Ext.getCmp("DutyPlanForm");
										fm.getCmpByName('dutyStaffs13.appUser.userId').setValue(userId);
										fm.getCmpByName('dutyStaffs13.appUser.fullname').setValue(fullName);
									}, true).show();
								}
							}]
						}]
					});
		if (this.planId!= null && this.planId != 'undefined') {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/duty/dutyListDutyStaff.do?planId='+ this.planId,
				waitMsg : '正在载入数据...',
				success : function(form, action) {
					var fp = Ext.getCmp('DutyPlanForm');
					var result = Ext.util.JSON.decode(action.response.responseText);
					var dutyPlan=result.data[0].dutyPlan;
					var planDate=dutyPlan.planDate;
					var planId=dutyPlan.id;
					Ext.getCmp('dutyPlan.id').setValue(planId);
					fp.getCmpByName('dutyPlan.planDate').setValue(planDate);
					Ext.getCmp('dutyPlan.planDate').minValue=null;
					for (i = 0;i <14; i += 1) {
						if(result.data[i].appUser!=null){
							fp.getCmpByName('dutyStaffs'+i+'.appUser.userId').setValue(result.data[i].appUser.userId);
							fp.getCmpByName('dutyStaffs'+i+'.appUser.fullname').setValue(result.data[i].appUser.fullname);
						}
					}
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('操作信息', '载入失败');
				}
			});
		}
		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					handler : function() {
						Ext.getCmp('DutyPlanForm').getForm().submit({
							url : __ctxPath + '/duty/isContainDutyPlan.do',
							waitMsg : '正在提交处理...',
							method:'post',
							success : function(fp, action) {
									var fp = Ext.getCmp('DutyPlanForm');
									var params = [];
										for (i = 0;i <14; i += 1) {
											var days = fp.getCmpByName('dutyStaffs'+i+'.Days').getValue();
											var ids = fp.getCmpByName('dutyStaffs'+i+'.appUser.userId').getValue();
											var sectionId=fp.getCmpByName('dutyStaffs'+i+'.sectionId').getValue();
											var au =ids?{userId:ids}:null;
											params.push({days:days,appUser:au,sectionId:sectionId});
										}	
									if (fp.getForm().isValid()) {
										fp.getForm().submit({
											method : 'post',
											params:{
												data: Ext.encode(params)
											},
											waitMsg : '正在提交数据...',
											success : function(fp, action) {
												Ext.ux.Toast.msg('操作信息', '成功保存信息！');
												if(Ext.getCmp('DutyPlanGrid')){
													Ext.getCmp('DutyPlanGrid').getStore().reload();
												}
												Ext.getCmp('DutyPlanFormWin').close();
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
							},
							failure : function(fp, action) {
								Ext.ux.Toast.msg('操作信息', '当前日期已安排值班！');
							}
						});
					}
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : function() {
						Ext.getCmp('DutyPlanFormWin').close();
					}
				}];//end of the buttons
	}//end of the initUIComponents
});
DiningReceptionOutForm = Ext.extend(Ext.Panel, {
	// 构造函数 - 开始
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		
		this.initUIComponents();
		DiningReceptionOutForm.superclass.constructor.call(this, {
			id : 'DiningReceptionOutFormWin',
			layout : 'form',
			items : [this.formPanel],
			modal : true,
			height : 400,
			width : 800,
			maximizable : true,
			title : '工作餐申请表单',
			buttonAlign : 'center',
			buttons : [
			           #set ($count=0)
						#foreach ($v in $nextTrans)
						#if($count>0),
						#end
						new Ext.Button({
						   iconCls:'btn-transition',
						   text:'提交',
						   handler:this.save.createCallback(this,'${v.name}','${v.source}','${v.destination}')
						})
						#set ($count=$count+1)
					#end
					]
		});
	},// 构造函数 - 结束
	
	// 初始化界面控件 - 开始
	initUIComponents : function() {	
	   var diningReceptionId=${diningreceptionId};
	   alert(diningreceptionId);
		var combodept = new Ext.form.ComboBox({
			fieldLabel : '申请部门',
			hiddenName : 'diningReception.department.depId',
			id : 'DiningRcptFdepartmentcombo',
			flex : 1,
			width : 200,
			xtype : 'combo',
			editable : false,
			allowBlank : true,
			triggerAction : 'all',
			displayField : 'depname',
			valueField : 'depid',
			mode : 'local',
			store : new Ext.data.SimpleStore(
					{
						autoLoad : true,
						url : __ctxPath + '/system/comboDepartment.do',
						fields : [ 'depid',
								'depname' ],
						listeners : {
							load : function() {
								Ext.getCmp('DiningRcptFdepartmentcombo')
									.setValue(Ext.getCmp('DiningRcptFdepartmentcombo').getValue());
								
							}
						}
					})
		});	
		var combomealtype = new Ext.form.ComboBox({
			fieldLabel : '用餐类别',
			hiddenName : 'diningReception.diningMealtype.id',
			id:'DiningRcptFmealtypeid',
			flex : 1,
			width : 150,
			xtype : 'combo',
			editable : false,
			allowBlank : false,
			triggerAction : 'all',
			displayField : 'typename',
			valueField : 'id',
			mode : 'local',
			store : new Ext.data.SimpleStore(
					{
						autoLoad : true,
						url : __ctxPath + '/diningMgnt/comboDiningMealtype.do',
						fields : [ 'id','typename' ],
						listeners : {
							load : function() {
									Ext.getCmp('DiningRcptFmealtypeid')
										.setValue(Ext.getCmp('DiningRcptFmealtypeid').getValue());
							}
						}							
					})		
		});

		var foodtypestore = new Ext.data.SimpleStore(
				{
					autoLoad : true,
					url : __ctxPath + '/diningMgnt/comboDiningFoodtype.do',
					fields : [ 'id','foodtypename' ],
					listeners : {
						load : function() {
								Ext.getCmp('DiningRcptFfoodtypeid')
									.setValue(Ext.getCmp('DiningRcptFfoodtypeid').getValue());
						}
					}									
				});		
		var combofoodtype = new Ext.form.ComboBox({
			fieldLabel : '用餐级别',
			hiddenName : 'diningReception.diningFoodtype.id',
			id:'DiningRcptFfoodtypeid',
			flex : 1,
			width : 150,
			xtype : 'combo',
			editable : false,
			allowBlank : false,
			triggerAction : 'all',
			displayField : 'foodtypename',
			valueField : 'id',
			mode : 'local',
			store : foodtypestore
		});
		
		combomealtype.on('select',function(combobox){
						
			foodtypestore.load({params:{
				'Q_diningMealtype.id_L_EQ':combobox.getValue(),
				'Q_category_S_EQ':'工作餐'}});
			combofoodtype.setValue('');
		});	
		
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
		    id : 'DiningReceptionForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'diningReception.id',
				xtype : 'hidden',
				value : diningReceptionId
			}, combodept, {
				fieldLabel : 'apply_userid',
				name : 'diningReception.appUser.userId',
				id:'diningReception.appUser.userId',
				allowBlank : false,
				xtype : 'hidden',
				value:curUserInfo.userId
			}, {
				fieldLabel : '用餐日期',
				name : 'diningReception.receptiondate',
				id:'diningReception.receptiondate',
				allowBlank : false,
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date(),
				editable:false
			}, combomealtype, combofoodtype, {
				fieldLabel : '接待对象',
				name : 'diningReception.receptiontarget',
				id:'diningReception.receptiontarget',
				allowBlank : false,
				maxLength : 100
			}, {
				fieldLabel : '订工作餐事由',
				name : 'diningReception.dinereason',
				id:'diningReception.dinereason',
				allowBlank : false,
				maxLength : 50
			}, {
				fieldLabel : '接待事由',
				name : 'diningReception.receptionreason',
				id:'diningReception.receptionreason',
				allowBlank : false,
				maxLength : 50
			}, {
				fieldLabel : '订餐数量(桌)',
				name : 'diningReception.receptionnumber',
				id:'diningReception.receptionnumber',
				allowBlank : false,
				xtype : 'numberfield'
			}, {
				fieldLabel : '用餐地点',
				name : 'diningReception.receptionplace',
				id:'diningReception.receptionplace',
				allowBlank : false,
				maxLength : 50
			}, {
				fieldLabel : '实际消费',
				name : 'diningReception.costlevel',
				id:'diningReception.costlevel',
				allowBlank : false,
				xtype : 'numberfield'
			} ,{
				name :'diningReception.status',
				xtype : 'hidden',
				value:1
			}]
		});
		// 加载表单对应的数据
		if (diningReceptionId== null && diningReceptionId=='undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/diningMgnt/getDiningReception.do?id='
						+ diningReceptionId,
				root : 'data',
				preName : 'diningReception'
			});
		}

	},// 初始化界面控件 - 结束
	
	// 保存并启动申请流程 - 开始
	save : function(panel,signalName,taskName,destName) {
		var taskId=panel.taskId;
		var flowAssignId=${flowAssignId};
		var fp = Ext.getCmp('DiningReceptionForm');
			
			if (fp.getForm().isValid()) {
				fp.getForm().submit(
								{
									url : __ctxPath + '/diningMgnt/saveDiningReception.do', 
									method : 'post',
									waitMsg : '正在提交数据...',
									success : function(fp,action) {
									
									var depid=Ext.getCmp('DiningRcptFdepartmentcombo').getValue();
								     var index=Ext.getCmp('DiningRcptFdepartmentcombo').store.find('depid',depid);
								     var depname=Ext.getCmp('DiningRcptFdepartmentcombo').store.getAt(index).get('depname');
								     alert(depname);
								     var DiningRcptFmealtypeid=Ext.getCmp('DiningRcptFmealtypeid').getValue();
								     var index2=Ext.getCmp('DiningRcptFmealtypeid').store.find('id',DiningRcptFmealtypeid);
								     var diningWLmealtypename=Ext.getCmp('DiningRcptFmealtypeid').store.getAt(index2).get('typename');
								     alert(diningWLmealtypename);
								     
								     var DiningRcptFfoodtypeid=Ext.getCmp('DiningRcptFfoodtypeid').getValue();
								     var index3=Ext.getCmp('DiningRcptFfoodtypeid').store.find('id',DiningRcptFfoodtypeid);
								     var diningWLfoodtypename=Ext.getCmp('DiningRcptFfoodtypeid').store.getAt(index3).get('foodtypename');
								     alert(diningWLfoodtypename);
								     
								     var userId=Ext.getCmp('diningReception.appUser.userId').getValue();
								     var receptiondate= Ext.getCmp('diningReception.receptiondate').getValue();
								     var receptiontarget= Ext.getCmp('diningReception.receptiontarget').getValue();
								     var dinereason= Ext.getCmp('diningReception.dinereason').getValue();
								     var receptionnumber =Ext.getCmp('diningReception.receptionnumber').getValue(); 
								     var costlevel= Ext.getCmp('diningReception.costlevel').getValue(); 
								     var receptionplace=Ext.getCmp('diningReception.receptionplace').getValue();
								     
//								     var flowAssignId = Ext.getCmp('receptiondepartflowAssignId').getValue();
								     var sendMail = msgPanel.getCmpByName('sendMail').getValue();
									 var sendMsg = msgPanel.getCmpByName('sendMsg').getValue();
									 
									 Ext.ux.Toast.msg('操作信息','成功保存信息！');
										
									 if (fp != null) {
										
											Ext.Ajax.request({
														url : __ctxPath + '/flow/nextProcessActivity.do',
														params:{
																	taskId:taskId,
																	signalName:signalName,
																	activityName:taskName,
																	destName:destName,
																	userId:userId,
																	depname:depname,
																	diningWLmealtypename:diningWLmealtypename,
																	diningWLfoodtypename:diningWLfoodtypename,
																	receptiondate:receptiondate,
																	receptiontarget:receptiontarget,
																	dinereason:dinereason,
																	receptionnumber:receptionnumber,
																	receptionplace:receptionplace,
																	costlevel:costlevel,
																	sendMail:sendMail,
																	sendMsg:sendMsg,
																	flowAssignId:flowAssignId,
																	//启动工作流
//																	rollFileId:rollFileId,
																	startFlow:true
																},
														success:function(resp,options){
																	
																	Ext.ux.Toast.msg('操作信息','成功启动接待餐申请流程');
																	var tabPanel = Ext.getCmp('centerTabPanel');
																	tabPanel.remove(Ext.getCmp('ProcessRunStart'+taskId));
																	//刷新列表窗口							
																	if(Ext.getCmp('TsItserviceApplyGrid') != null){								
																		Ext.getCmp('TsItserviceApplyGrid').getStore().reload();		
																		}							
																	refreshTaskPanelView();
																}
												});
										}
									},
									failure : function(fp,action) {
											Ext.MessageBox
													.show( {
														title : '操作信息',
														msg : '信息保存出错，请联系管理员！',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
										
										Ext.getCmp('DiningReceptionOutFormWin').close();
									}
								});
			}
		}// 保存并启动申请流程 - 结束
})
InvitationContractForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		InvitationContractForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'InvitationContractFormWin',
					title : '合同详细信息',
					iconCls : 'menu-invitation',
					width : 950,/*822*/
					height : 500,
					autoScroll:true,
//					minWidth : 1200,/*821*/
					items : this.formPanel,
					border : false,
					modal : true,
					plain : true,
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		// 合同付款条件
		var payConditionGrid = new PayConditionView();
		//进度追踪
		var progressTraceGrid = new ProgressTraceView();
		//进度追踪
		var changeTraceGrid = new ChangeTraceView();
		// 初始化form表单
		this.formPanel = new Ext.FormPanel({
			url : __ctxPath + '/invitation/saveInvitationContract.do',
			layout : 'hbox',
			frame : true,
			autoScroll:true,	
			// baseCls:'x-plain',
			layoutConfig : {
				padding : '5',
				pack : 'start',
				align : 'middle'
			},
			defaults : {
				margins : '0 5 0 0'
			},
			
			id : 'InvitationContractForm',
			formId : 'InvitationContractFormId',
			defaultType : 'textfield',
			items : [{
				xtype : 'fieldset',
				title : '合同信息(带 * 号为必填)',
				layout : 'form',
				rowspan : 2,
				defaultType : 'textfield',
				width : 900,
				items : [
				//start
				
				{
						// cxt
						layout : 'column',
						xtype : 'fieldset',
						title : '基本信息',
						width : 870,
						// columnWidth:.5,
						// autoHeight:true,
						items : [{
									columnWidth : 0.3,
									layout : 'form',
									items :[{
											  xtype : 'hidden',
											  name:"invitationContract.alreadyPay", 
											  id : "invitationContract.alreadyPay",
											  value:0
											  
										  },{
											xtype : 'hidden',
											name:"invitationContract.tempAlreadyPay", 
											id :"invitationContract.tempAlreadyPay"										
											},
										  {										
											name : 'invitationContract.contractId',
											id : 'contractId',
											xtype : 'hidden',
											value : this.contractId == null
													? ''
													: this.contractId
										  }, {
											fieldLabel : '合同编号*',
											name : 'invitationContract.contractNo',
											id : 'contractNo',
											allowBlank : false,
											blankText : '合同编号不可为空!',
											xtype : 'textfield'
										}, {
											fieldLabel : '合同类型',
											name : 'invitationContract.contractType',
											id : 'contractType',
											//allowBlank : false,
										//	blankText : '合同类型不可为空!',
											xtype : 'textfield'
										}, {
											fieldLabel : '合同主题',
											xtype : 'textfield',
											name : 'invitationContract.contractTheme',
											id : 'contractTheme'
											//allowBlank : false,
											//blankText : '合同主题不可为空!'
										}, {
											fieldLabel : '预算编号',
											xtype : 'textfield',
											name : 'invitationContract.budgetNo',
											id : 'budgetNo'
										},{
											fieldLabel : '合同经办人',
											name : 'invitationContract.draftsman',
											id : 'draftsman',
											xtype : 'textfield'
											//allowBlank : false,
											//blankText : '合同经办人不可为空!'
										}, {
											fieldLabel : '项目主办人',
											name : 'invitationContract.undertaker',
											id : 'undertaker',
											xtype : 'textfield'
											//allowBlank : false,
											//blankText : '项目主办人不可为空!'
										}, {
											fieldLabel : '项目主办部门',
											xtype : 'textfield',
											name : 'invitationContract.undertakerDepartment',
											id : 'undertakerDepartment'
									
										},{
											fieldLabel : '合同定稿时间',
											xtype : 'datefield',
											name : 'invitationContract.finalizeTime',
											id : 'finalizeTime',
											format : 'Y-m-d',
											editable : false,
											width:130
											//allowBlank : false,
									    	//	blankText : '合同定稿时间不可为空!'
										},{
											fieldLabel : '合同签订时间',
											xtype : 'datefield',
											name : 'invitationContract.signTime',
											id : 'signTime',
											format : 'Y-m-d',
											editable : false,
											width:130
											//allowBlank : false,
											//blankText : '合同签订时间不可为空!'
										},{
											fieldLabel : '合同总金额',
											xtype : 'numberfield',
											name : 'invitationContract.contractMoney',
											id : 'contractMoney'
										},{
											fieldLabel : '履约保证金',
											xtype : 'numberfield',
											name : 'invitationContract.guaranteeMoney',
											id : 'guaranteeMoney'
										}]
							            	},//
										{//新增栏位
											columnWidth : 0.3,
											layout : 'form',
											items :[//start
												{
												fieldLabel : '采购方式',
												xtype : 'textfield',
												name : 'invitationContract.purchaseType',
												id : 'purchaseType'
											},{
												fieldLabel : '年份',
												xtype : 'textfield',
												name : 'invitationContract.year',
												id : 'year'
											},{
												fieldLabel : '采购平台',
												xtype : 'textfield',
												name : 'invitationContract.purPlatform',
												id : 'purPlatform'
											},{
												fieldLabel : '合同所属年份',
												xtype : 'textfield',
												name : 'invitationContract.yearBelong',
												id : 'yearBelong'
											},{
												fieldLabel : '单价/总价合同',
												xtype : 'radiogroup',
												//name : 'invitationContract.contactTypeTitle',
												id : 'contactType',
												items : [{
													boxLabel : '单价',
													// name : 'rb-auto',
													name : 'invitationContract.contactType',
													inputValue : 0
													// ,checked : true
												}, {
													boxLabel : '总价',
													// name : 'rb-auto',
													name : 'invitationContract.contactType',
													inputValue : 1
												}]
												
												
											},{
												fieldLabel : '合同开始日期',
												//xtype : 'numberfield',
												xtype : 'datefield',
												format : 'Y-m-d',
												name : 'invitationContract.startDate',
												id : 'startDate',
												width:130
											},{
												fieldLabel : '合同结束日期',
												//xtype : 'numberfield',
												xtype : 'datefield',
												format : 'Y-m-d',
												name : 'invitationContract.endDate',
												id : 'endDate',
												width:130
											},{
												fieldLabel : '是否已执行完成',
												xtype : 'radiogroup',
												//name : 'invitationContract.isFinished',
												id : 'isFinished',
												items : [{
													boxLabel : '是',
													// name : 'rb-auto',
													name : 'invitationContract.isFinished',
													inputValue : 1
													// ,checked : true
												}, {
													boxLabel : '否',
													// name : 'rb-auto',
													name : 'invitationContract.isFinished',
													inputValue : 0
												}]
											},{
												fieldLabel : '续签合同对应原合同号',
												xtype : 'textfield',
												name : 'invitationContract.preContactNo',
												id : 'preContactNo'
											},{
												fieldLabel : '履约情况（付款金额占合同金额比例）',
												xtype : 'textfield',
												name : 'invitationContract.payCondition',
												id : 'payCondition'
											}
											//end
											]
							
					              },{
									columnWidth : 0.3,
									layout : 'form',
									items :[{
											fieldLabel : '保修金额',
											xtype : 'numberfield',
											name : 'invitationContract.repairMoney',
											id : 'repairMoney'
										},{
											fieldLabel : '首付金额',
											xtype : 'numberfield',
											name : 'invitationContract.firstMoney',
											id : 'firstMoney'
										},{
											fieldLabel : '甲方',
											xtype : 'textfield',
											name : 'invitationContract.firstPart',
											id : 'firstPart'
										},{
											fieldLabel : '乙方',
											xtype : 'textfield',
											name : 'invitationContract.secondPart',
											id : 'secondPart'
										},{
											fieldLabel : '备注',
											xtype : 'textarea',
											name : 'invitationContract.remarks',
											id : 'remarks',
											width:130
										},{
											xtype : 'hidden',
											name : 'invitationContract.createBy',
											value:''
										},{
											xtype : 'hidden',
											name : 'invitationContract.createDate',
											value: new Date().format('Y-m-d')
										},{
											xtype : 'hidden',
											name : 'invitationContract.lastEditBy',
											value:''
										},{
											xtype : 'hidden',
											name : 'invitationContract.lastEditDate',
											value: new Date().format('Y-m-d')
										},{
											xtype : 'compositefield',
											fieldLabel : '合同附件',
											items : [{
														xtype : 'panel',
														id : 'displayInvitationContractAttach',
														width : 100,
														frame : true,
														height : 65,
														html:''
													}, {
														xtype : 'button',
														iconCls : 'btn-upload',
														text : '上传',
														handler : function() {
															var dialog = App
																	.createUploadDialog({
																		file_cat : 'invitation',
																		callback : uploadInvitationContractAttach
																	});
															dialog.show('queryBtn');
														}
													}, {
														xtype : 'hidden',
														name : 'invitationContractAttachIDs',
														id : 'invitationContractAttachIDs'
													}]
										}]
					
								}]
			            	},//
				{
				xtype : 'container',
				style : 'padding:5px 0px 0px 0px;',
				items : [{
					xtype : 'fieldset',
					title : '其它信息',
					layout : 'form',
					labelWidth : 55,
					width : 870,	
					autoScroll:true,
					style : 'padding-bottom:0px;bottom:0px;',
					defaultType : 'textfield',
						items : [{
							xtype : 'fieldset',
							title : '付款条件',
							layout : 'form',
							width : 840,
							style : 'padding-top:0px;top:0px;',
							height : 170,
							labelWidth : 58,
							defaultType : 'textfield',
							items : [payConditionGrid]
						 },{
								xtype : 'fieldset',
								title : '进度追踪',
								layout : 'form',
								width : 840,
								style : 'padding-top:0px;top:0px;',
								height : 170,
								labelWidth : 58,
								defaultType : 'textfield',
								items : [progressTraceGrid]
							 },{
									xtype : 'fieldset',
									title : '变更追踪',
									layout : 'form',
									width : 840,
									style : 'padding-top:0px;top:0px;',
									height : 170,
									// height : 150,
									labelWidth : 58,
									defaultType : 'textfield',
									items : [changeTraceGrid]
								 }]
				}]
			}
				]
			}]
		}
				//end
						
							
								
									
										
								/*			{
							name : 'invitationContract.contractId',
							id : 'contractId',
							xtype : 'hidden',
							value : this.contractId == null
									? ''
									: this.contractId
						}, {
							fieldLabel : '合同编号*',
							name : 'invitationContract.contractNo',
							id : 'contractNo',
							allowBlank : false,
							blankText : '合同编号不可为空!'
						}, {
							fieldLabel : '合同类型*',
							name : 'invitationContract.contractType',
							id : 'contractType',
							allowBlank : false,
							blankText : '合同类型不可为空!'
						}, {
							fieldLabel : '合同主题*',
							xtype : 'textfield',
							name : 'invitationContract.contractTheme',
							id : 'contractTheme',
							allowBlank : false,
							blankText : '合同主题不可为空!'
						}, {
							fieldLabel : '预算编号',
							xtype : 'textfield',
							name : 'invitationContract.budgetNo',
							id : 'budgetNo'
						},{
							fieldLabel : '合同经办人*',
							name : 'invitationContract.draftsman',
							id : 'draftsman',
							allowBlank : false,
							blankText : '合同经办人不可为空!'
						}, {
							fieldLabel : '项目主办人*',
							name : 'invitationContract.undertaker',
							id : 'undertaker',
							allowBlank : false,
							blankText : '项目主办人不可为空!'
						}, {
							fieldLabel : '项目主办部门',
							xtype : 'textfield',
							name : 'invitationContract.undertakerDepartment',
							id : 'undertakerDepartment'
					
						},{
							fieldLabel : '合同定稿时间*',
							xtype : 'datefield',
							name : 'invitationContract.finalizeTime',
							id : 'finalizeTime',
							format : 'Y-m-d',
							editable : false,
							allowBlank : false,
							blankText : '合同定稿时间不可为空!'
						},{
							fieldLabel : '合同签订时间*',
							xtype : 'datefield',
							name : 'invitationContract.signTime',
							id : 'signTime',
							format : 'Y-m-d',
							editable : false,
							allowBlank : false,
							blankText : '合同签订时间不可为空!'
						},{
							fieldLabel : '合同总金额',
							xtype : 'numberfield',
							name : 'invitationContract.contractMoney',
							id : 'contractMoney'
						},{
							fieldLabel : '履约保证金',
							xtype : 'numberfield',
							name : 'invitationContract.guaranteeMoney',
							id : 'guaranteeMoney'
						},{
							fieldLabel : '保修金额',
							xtype : 'numberfield',
							name : 'invitationContract.repairMoney',
							id : 'repairMoney'
						},{
							fieldLabel : '首付金额',
							xtype : 'numberfield',
							name : 'invitationContract.firstMoney',
							id : 'firstMoney'
						},{
							fieldLabel : '甲方',
							xtype : 'textfield',
							name : 'invitationContract.firstPart',
							id : 'firstPart'
						},{
							fieldLabel : '乙方',
							xtype : 'textfield',
							name : 'invitationContract.secondPart',
							id : 'secondPart'
						},{
							fieldLabel : '备注',
							xtype : 'textarea',
							name : 'invitationContract.remarks',
							id : 'remarks'
						},{
							xtype : 'hidden',
							name : 'invitationContract.createBy',
							value:''
						},{
							xtype : 'hidden',
							name : 'invitationContract.createDate',
							value: new Date().format('Y-m-d H:i:s')
						},{
							xtype : 'hidden',
							name : 'invitationContract.lastEditBy',
							value:''
						},{
							xtype : 'hidden',
							name : 'invitationContract.lastEditDate',
							value: new Date().format('Y-m-d H:i:s')
						},{
							xtype : 'compositefield',
							fieldLabel : '合同附件',
							items : [{
										xtype : 'panel',
										id : 'displayInvitationContractAttach',
										width : 205,
										frame : true,
										height : 65,
										html:''
									}, {
										xtype : 'button',
										iconCls : 'btn-upload',
										text : '上传',
										handler : function() {
											var dialog = App
													.createUploadDialog({
														file_cat : 'invitation',
														callback : uploadInvitationContractAttach
													});
											dialog.show('queryBtn');
										}
									}, {
										xtype : 'hidden',
										name : 'invitationContractAttachIDs',
										id : 'invitationContractAttachIDs'
									}]
						}]
			} , {
				xtype : 'container',
				style : 'padding:5px 0px 0px 0px;',
				items : [{
					xtype : 'fieldset',
					title : '其它信息',
					layout : 'form',
					labelWidth : 55,
					width : 500,380
					height : 563,
					style : 'padding-bottom:0px;bottom:0px;',
					defaultType : 'textfield',
						items : [{
							xtype : 'fieldset',
							title : '付款条件',
							layout : 'form',
							width : 475,
							style : 'padding-top:0px;top:0px;',
							height : 170,
							labelWidth : 58,
							defaultType : 'textfield',
							items : [payConditionGrid]
						 },{
								xtype : 'fieldset',
								title : '进度追踪',
								layout : 'form',
								width : 475,
								style : 'padding-top:0px;top:0px;',
								height : 170,
								labelWidth : 58,
								defaultType : 'textfield',
								items : [progressTraceGrid]
							 },{
									xtype : 'fieldset',
									title : '变更追踪',
									layout : 'form',
									width : 475,
									style : 'padding-top:0px;top:0px;',
									height : 170,
									// height : 150,
									labelWidth : 58,
									defaultType : 'textfield',
									items : [changeTraceGrid]
								 }]
				}]
			}
			
			
			]*/
		);// end of the formPanel

		if (this.contractId != null && this.contractId != 'undefined') {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/invitation/getInvitationContract.do?contractId='
						+ this.contractId,
				waitMsg : '正在载入数据...',
				success : function(form, action) {
                //时间格式变换
				if(action.result.data.signTime!=null){
					var signTime = getDateFromFormat(action.result.data.signTime,
				'yyyy-MM-dd HH:mm:ss');
		       	 Ext.getCmp('signTime').setValue(new Date(signTime));
					}
				if(action.result.data.finalizeTime!=null){
		       		 var finalizeTime = getDateFromFormat(action.result.data.finalizeTime,
				'yyyy-MM-dd HH:mm:ss');
		       		 Ext.getCmp('finalizeTime').setValue(new Date(finalizeTime));
					}
		        if(action.result.data.startDate!=null){
		        	 var startDate = getDateFromFormat(action.result.data.startDate,
				'yyyy-MM-dd HH:mm:ss');
		       		 Ext.getCmp('startDate').setValue(new Date(startDate));
		        }
		          if(action.result.data.endDate!=null){
		        	 var endDate = getDateFromFormat(action.result.data.endDate,
				'yyyy-MM-dd HH:mm:ss');
		       		 Ext.getCmp('endDate').setValue(new Date(endDate));
		        }
                //载入合同付款条件		        
		        var contractId = Ext.getCmp('contractId').value;
				if (contractId != null && contractId != ''
						&& contractId != 'undefined') {
					var store = Ext.getCmp('PayConditionGrid').getStore();
					store.reload({
								params : {
									'Q_invitationContract.contractId_L_EQ' : contractId
								}
							});
				}
				//载入进度追踪
				if (contractId != null && contractId != ''
					&& contractId != 'undefined') {
				var store = Ext.getCmp('ProgressTraceGrid').getStore();
				store.reload({
							params : {
								'Q_invitationContract.contractId_L_EQ' : contractId
							}
						});
			    }
				//载入变更追踪
				if (contractId != null && contractId != ''
					&& contractId != 'undefined') {
				var store = Ext.getCmp('ChangeTraceGrid').getStore();
				store.reload({
							params : {
								'Q_invitationContract.contractId_L_EQ' : contractId
							}
						});
			    }
				// 载入附件
				   var af = action.result.data.invitationContractAttach;
					var filePanel = Ext.getCmp('displayInvitationContractAttach');
					var fileIds = Ext.getCmp("invitationContractAttachIDs");
									
					for (var i = 0; i < af.length; i++) {
						if (fileIds.getValue() != '') {
							fileIds.setValue(fileIds.getValue() + ',');
						}
						fileIds.setValue(fileIds.getValue() + af[i].fileId);
						
						Ext.DomHelper
								.append(
										filePanel.body,
										'<span><a href="#" onclick="FileAttachDetail.show('
												+ af[i].fileId
												+ ')">'
												+ af[i].fileName
												+ '</a><img class="img-delete" src="'
												+ __ctxPath
												+ '/images/system/delete.gif" onclick="removeInvitationContractAttach(this,'
												+ af[i].fileId
												+ ')"/>&nbsp;|&nbsp;</span>');
					}
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('编辑', '载入失败');
				}
			});
		}// end of load formPanel

		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					handler : function() {
			        InvitationContractForm.saveInvitationContract();
					}
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : function() {
						Ext.getCmp('InvitationContractFormWin').close();
					}
				}]
	}// end of the initUIComponents
});


/**
 * 保存标案方法
 */
InvitationContractForm.saveInvitationContract = function() {
	
	var fp = Ext.getCmp('InvitationContractForm');
	var contractId = Ext.getCmp('contractId').getValue();//获取ContractID号
	
	if (fp.getForm().isValid()) {
	//验证合同条件
	var store = Ext.getCmp('PayConditionGrid').getStore();
	var params = [];

	for (i = 0, cnt = store.getCount(); i < cnt; i += 1) {
		var record = store.getAt(i);
		
	/*	if (record.data.payPeriods == 0|| record.data.payPeriods == 'undefined') {
			
			Ext.ux.Toast.msg('提示信息', '付款期数为必填!');
			return;
		}
		*/
		if (record.data.payTime == null || record.data.payTime == ''
				|| record.data.payTime == 'undefined') {
			//Ext.ux.Toast.msg('提示信息', '付款时间为必填!');
			//return;
		}else{
			record.data.payTime = new Date(record.data.payTime).dateFormat('m/d/Y');
		}
		/*
		if (record.data.payConditon == null || record.data.payConditon == ''
				|| record.data.payConditon == 'undefined') {
			Ext.ux.Toast.msg('提示信息', '付款条件为必填!');
			return;
		}
		if (record.data.payMoney == null || record.data.payMoney == ''
			|| record.data.payMoney == 'undefined') {
		     Ext.ux.Toast.msg('提示信息', '付款金额为必填!');
		     return;
	    }*/
		
		// 为空的payPeriods数据初始化为null
		 if (record.data.payPeriods == '' || record.data.payPeriods == 'undefined') {
			  record.data.payPeriods =null;
		  }			
		
		if (record.data.contractId == '' || record.data.contractId == null) {// 设置未保存的assignId标记，方便服务端进行gson转化
			record.set('contractId', -1);
		}

		if (record.dirty) // 得到所有修改过的数据
			params.push(record.data);
	}	
		
		//验证合同进度追踪
		var storeProgressTrace = Ext.getCmp('ProgressTraceGrid').getStore();
		var paramsProgressTrace = [];
    	for (i = 0, cntProgressTrace = storeProgressTrace.getCount(); i < cntProgressTrace; i += 1) {

			var recordProgressTrace = storeProgressTrace.getAt(i);			
			
			/*if (recordProgressTrace.data.payMoney == null || recordProgressTrace.data.payMoney == ''
				|| recordProgressTrace.data.payMoney == 'undefined') {
			     Ext.ux.Toast.msg('提示信息', '支付金额为必填!');
			     return;
		    }
			if (recordProgressTrace.data.payPeriods==null||recordProgressTrace.data.payPeriods == 0|| recordProgressTrace.data.payPeriods == 'undefined') {
				
				Ext.ux.Toast.msg('提示信息', '支付期数为必填!');
				return;
			}
			*/
			if (recordProgressTrace.data.payTime == null || recordProgressTrace.data.payTime == ''
					|| recordProgressTrace.data.payTime == 'undefined') {
			//	Ext.ux.Toast.msg('提示信息', '支付时间为必填!');
				//return;
			}else{
				recordProgressTrace.data.payTime = new Date(recordProgressTrace.data.payTime).dateFormat('m/d/Y');
			}
			
			if (recordProgressTrace.data.nextPayTime == null || recordProgressTrace.data.nextPayTime == ''
				|| recordProgressTrace.data.nextPayTime == 'undefined') {
			   // Ext.ux.Toast.msg('提示信息', '预计下次支付时间为必填!');
			   // return;
		     }else{
			    recordProgressTrace.data.nextPayTime = new Date(recordProgressTrace.data.nextPayTime).dateFormat('m/d/Y');
		     }
		    /*
			if (recordProgressTrace.data.status == null || recordProgressTrace.data.status == ''
					|| recordProgressTrace.data.status == 'undefined') {
				Ext.ux.Toast.msg('提示信息', '工作完成状态为必填!');
				return;
			}
			if (recordProgressTrace.data.payMoney == null || recordProgressTrace.data.payMoney == ''
				|| recordProgressTrace.data.payMoney == 'undefined') {
			     Ext.ux.Toast.msg('提示信息', '支付金额为必填!');
			     return;
		    }
			*/
			
		     // 20121115 xt st 为空的payPeriods数据初始化为null
		     if (recordProgressTrace.data.payPeriods == '' || recordProgressTrace.data.payPeriods == 'undefined') {
			  recordProgressTrace.data.payPeriods =null;
		     }		     
		     // xt end
		     
			if (recordProgressTrace.data.contractId == '' || recordProgressTrace.data.contractId == null) {// 设置未保存的assignId标记，方便服务端进行gson转化
				recordProgressTrace.set('contractId', -1);
			}

			if (recordProgressTrace.dirty) // 得到所有修改过的数据
				paramsProgressTrace.push(recordProgressTrace.data);
		}	
		
			//验证变更追踪
			var storeChangeTrace = Ext.getCmp('ChangeTraceGrid').getStore();
			var paramsChangeTrace = [];

			for (i = 0, cntChangeTrace = storeChangeTrace.getCount(); i < cntChangeTrace; i += 1) {
				var recordChangeTrace = storeChangeTrace.getAt(i);			
				
				
				/*if (recordChangeTrace.data.isSign == ''|| recordChangeTrace.data.isSign == null
					 ||recordChangeTrace.data.isSign == 'undefined') {
					
					Ext.ux.Toast.msg('提示信息', '合同是否签订为必填!');
					return;
				}
				*/
				if (recordChangeTrace.data.launchTime == null || recordChangeTrace.data.launchTime == ''
						|| recordChangeTrace.data.launchTime == 'undefined') {
				//	Ext.ux.Toast.msg('提示信息', '发起时间为必填!');
				//	return;
				}else{
					recordChangeTrace.data.launchTime = new Date(recordChangeTrace.data.launchTime).dateFormat('m/d/Y');
				}
				if (recordChangeTrace.data.checkTime == null || recordChangeTrace.data.checkTime == ''
					|| recordChangeTrace.data.checkTime == 'undefined') {
				 //   Ext.ux.Toast.msg('提示信息', '核准时间为必填!');
				 //    return;
			    }else{
				    recordChangeTrace.data.checkTime = new Date(recordChangeTrace.data.checkTime).dateFormat('m/d/Y');
			     }
			     
			     /*
				if (recordChangeTrace.data.content == null || recordChangeTrace.data.content == ''
						|| recordChangeTrace.data.content == 'undefined') {
					Ext.ux.Toast.msg('提示信息', '变更内容说明为必填!');
					return;
				}
				if (recordChangeTrace.data.remarks == null || recordChangeTrace.data.remarks == ''
					|| recordChangeTrace.data.remarks == 'undefined') {
				     Ext.ux.Toast.msg('提示信息', '备注为必填!');
				     return;
			    }*/
				
				if (recordChangeTrace.data.contractId == '' || recordChangeTrace.data.contractId == null) {// 设置未保存的assignId标记，方便服务端进行gson转化
					recordChangeTrace.set('contractId', -1);
				}
				if (recordChangeTrace.dirty) // 得到所有修改过的数据
					paramsChangeTrace.push(recordChangeTrace.data);
			}					
			var gridPanel = Ext.getCmp('ProgressTraceGrid');
			if(gridPanel != null) {
				var store = gridPanel.getStore();
				var sumMoney=0;
				for (var i = 0; i < store.getCount(); i++) {
					if(store.getAt(i).get('payMoney') != null) {
						sumMoney+=Number(store.getAt(i).get('payMoney'));						
					}
				}	
			 Ext.getCmp('invitationContract.alreadyPay').setValue(sumMoney);			
			}
			
	    fp.getForm().submit({
				method : 'post',
				params:{
	    	       docs : Ext.encode(params),//docs即为所传内容
	    	       docsProgressTrace : Ext.encode(paramsProgressTrace),
	    	       docsChangeTrace : Ext.encode(paramsChangeTrace)
                 },
				url : __ctxPath + '/invitation/saveInvitationContract.do',
				waitMsg : '正在提交数据...',
				success : function(fp, action) {
					Ext.ux.Toast.msg('操作信息', '成功保存信息！');
					var grid = Ext.getCmp('InvitationContractGrid');
					if (grid != null && grid != undefined) {
						Ext.getCmp('InvitationContractGrid').getStore().reload();
					}
					Ext.getCmp('InvitationContractFormWin').close();
				},
				failure : function(fp, action) {
					Ext.MessageBox.show({
								title : '操作信息',
								msg : '操作异常',//action.result.msg,
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});
				}
			});
	}
}
	

/**
 * 上传合同附件
 */
function uploadInvitationContractAttach(data) {
	
	var fileIds = Ext.getCmp('invitationContractAttachIDs');
	var display = Ext.getCmp('displayInvitationContractAttach');
	for (var i = 0; i < data.length; i++) {
		if (fileIds.getValue() != '') {
			fileIds.setValue(fileIds.getValue() + ',');
		}
		fileIds.setValue(fileIds.getValue() + data[i].fileId);

		Ext.DomHelper
				.append(
						display.body,
						'<span><a href="#" onclick="FileAttachDetail.show('
								+ data[i].fileId
								+ ')">'
								+ data[i].filename
								+ '</a><img class="img-delete" src="'
								+ __ctxPath
								+ '/images/system/delete.gif" onclick="removeInvitationContractAttach(this,'
								+ data[i].fileId + ')"/>&nbsp;|&nbsp;</span>');
	}
}
/**
 * 删除合同附件
 * 
 * @param {}
 *            obj
 * @param {}
 *            _fileId
 */
function removeInvitationContractAttach(obj, _fileId) {
	var fileIds = Ext.getCmp("invitationContractAttachIDs");
	var value = fileIds.getValue();
	if (value.indexOf(',') < 0) {// 仅有一个附件
		fileIds.setValue('');
	} else {
		value = value.replace(',' + _fileId, '').replace(_fileId + ',', '');
		fileIds.setValue(value);
	}

	var el = Ext.get(obj.parentNode);
	el.remove();

	var contractId = Ext.getCmp('contractId').value;
	if (contractId != null && contractId != '' && contractId != 'undefined') {
		Ext.Ajax.request({
					url : __ctxPath + '/invitation/removeFileInvitationContract.do',
					params : {
						contractId : contractId,
						invitationContractAttachIDs : _fileId
					},
					method : 'post',
					success : function() {
						Ext.Ajax.request({
									url : __ctxPath
											+ '/system/multiDelFileAttach.do',
									params : {
										ids : _fileId
									},
									method : 'post',
									success : function() {
										Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
									}
								})
					}
				})
	} else {
		Ext.Ajax.request({
					url : __ctxPath + '/system/multiDelFileAttach.do',
					params : {
						ids : _fileId
					},
					method : 'post',
					success : function() {
						Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
					}
				});
	}
}


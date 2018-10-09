OutTripApplyWinForm = Ext.extend(Ext.Window, {

	// 构造函数 - 开始
	constructor : function(_cfg) {
		
		Ext.applyIf(this, _cfg);
		
		this.initUIComponents();
		
		OutTripApplyWinForm.superclass.constructor.call(this, {
			id : 'OutTripApplyWinForm',
			layout : 'form',
			items : [this.formPanel,this.gridPanel],
			modal : true,
			height : 579,
			width : 800,
			maximizable : true,
			title : '录入外出出差申请表单',
			buttonAlign : 'center',
			buttons : [
				{
					text : '保存并启动流程',
					iconCls : 'btn-save',
					scope : this,
					handler : this.save.createCallback(this.formPanel, this)
				},
				{
					text : '重置',
					iconCls : 'btn-reset',
					scope : this,
					handler : this.reset
				},
				{
					text : '取消',
					iconCls : 'btn-cancel',
					scope : this,
					handler : this.cancel.createCallback(this)
				}
			]
		});
		
	},// 构造函数 - 结束
	
	// 初始化界面控件 - 开始
	initUIComponents : function() {
		
		// 取得当前用户所在部门的主管(正部长、副部长)信息(ID、NAME)
		var comboStore = new Ext.data.SimpleStore({
			url : __ctxPath + '/system/getLeadersAppUser.do',
			autoLoad : true,
			fields : ['flowAssignId', 'flowAssignName']
		});
		
		// 对下拉选单控件赋予默认值
		comboStore.on('load', function(store, record, opts) {
			var combo = Ext.getCmp("OutTripApplyWinForm.nextFlowExaminerName");
			// 获取选项中第一项的值
			var firstValue = store.getAt(0).get('flowAssignId');
			var fm = Ext.getCmp("OutTripApplyWinForm");
			fm.getCmpByName('nextFlowExaminerId').setValue(firstValue);
			combo.setValue(firstValue);
		});
		
		// 取得出差类别
		var classIdStore = new Ext.data.SimpleStore({
			url : __ctxPath + '/admin/combolistOutTripClass.do',
			autoLoad : true,
			fields : ['realValue', 'displayValue']
		});
		
		// 对下拉选单控件赋予默认值
		classIdStore.on('load', function(store, record, opts) {
			var combo = Ext.getCmp("OutTripApplyWinForm.comboClassId");
			// 获取选项中第一项的值
			var firstValue = store.getAt(0).get('realValue');
			var fm = Ext.getCmp("OutTripApplyWinForm");
			fm.getCmpByName('outTripApply.outTripClass.id').setValue(firstValue);
			combo.setValue(firstValue);
		});
		
		// Panel1：主表单部分
		this.formPanel = new Ext.form.FormPanel({
			id : 'OutTripApplyWinForm',
			layout : 'form',
			bodyStyle : 'padding:10px',
			autoScroll : true,
			defaults : {
				border : false,
				anchor : '98%,98%'
			},
			items : [
				{
					layout : 'column',
					items : [
						{
							columnWidth : 0.20,
							layout : 'form',
							labelWidth : 60,
							border : false,
							items : {
								fieldLabel : '申请人员',
								xtype : 'textfield',
								name : 'fieldApplicantId',
								id : 'OutTripApplyWinForm.fieldApplicantId',
								width : 80,
								allowBlank : false,
								maxLength : 128,
								value : curUserInfo.fullname,
								editable : false,
								readOnly : true
							}
						},
						{
							xtype : 'hidden',
							id : 'OutTripApplyWinForm.applicantId',
							name : 'outTripApply.applicantId',
							value : curUserInfo.userId
						},
						{
							// 下拉选单 - 出差类别
							columnWidth : 0.23,
							layout : 'form',
							labelWidth : 60,
							border : false,
							style : 'margin:0 0 0 10px',
							items : {
								fieldLabel : "出差类别",
								xtype : "combo",
								name : "comboClassId",
								id : "OutTripApplyWinForm.comboClassId",
								valueField : 'realValue',
								displayField : 'displayValue',
								width : 90,
								mode : 'local',
								editable : false,
								typeAhead : true,
								triggerAction : 'all',
								allowBlank : false,
								store : classIdStore,
								listeners : {
									select : function(cbo, record, index) {
										var fm = Ext.getCmp("OutTripApplyWinForm");
										fm.getCmpByName('outTripApply.outTripClass.id').setValue(cbo.getValue());
									}
								}
							}
						},
						{
							name : 'outTripApply.outTripClass.id',
							xtype : 'hidden'
						},
						{
							// 下拉选单 - 出差费用类型
							columnWidth : 0.28,
							layout : 'form',
							labelWidth : 80,
							border : false,
							style : 'margin:0 0 0 20px',
							items : {
								fieldLabel : '出差费用类型',
								xtype : 'combo',
								hiddenName : 'outTripApply.feeType',
								width : 90,
								allowBlank : false,
								editable : false,
								mode : 'local',
								triggerAction : 'all',
								value : '0',
								store : [ [ '0', '不发生费用' ], [ '1', '发生费用' ] ]
							}
						},
						{
							columnWidth : 0.29,
							layout : 'form',
							labelWidth : 95,
							border : false,
							items : {
								fieldLabel : '出差费用提供者',
								xtype : 'textfield',
								name : 'outTripApply.feeSupplier',
								id : 'OutTripApplyWinForm.feeSupplier',
								width : 90,
								allowBlank : false,
								maxLength : 128
							}
						}
					]
				},
				{
					layout : 'column',
					items : [
						{
							columnWidth : 0.35,
							layout : 'form',
							labelWidth : 60,
							border : false,
							items : {
								fieldLabel : '开始日期',
								xtype : 'datetimefield',
								format : 'Y-m-d H:i:s',
								name : 'outTripApply.tripSDt',
								allowBlank : false,
								width : 170
							}
						},
						{
							columnWidth : 0.35,
							layout : 'form',
							labelWidth : 60,
							border : false,
							items : {
								fieldLabel : '结束日期',
								xtype : 'datetimefield',
								format : 'Y-m-d H:i:s',
								name : 'outTripApply.tripEDt',
								allowBlank : false,
								width : 170
							}
						},
						{
							columnWidth : 0.25,
							layout : 'form',
							labelWidth : 60,
							border : false,
							items : {
								fieldLabel : '出差地点',
								xtype : 'textfield',
								name : 'outTripApply.site',
								width : 118,
								allowBlank : false,
								maxLength : 128
							}
						}
					]
				},
				{
					
					columnWidth : 0.95,
					layout : 'form',
					labelWidth : 60,
					items : {
						fieldLabel : '出差主题',
						xtype : 'textfield',
						name : 'outTripApply.topic',
						width : 650,
						allowBlank : false,
						maxLength : 300
					}
				},
				{
					columnWidth : 0.95,
					layout : 'form',
					labelWidth : 60,
					items : {
						fieldLabel : '出差事由',
						xtype : 'textarea',
						name : 'outTripApply.description',
						width : 650,
						maxLength : 300
					}
				},
				{
					
					columnWidth : 0.95,
					layout : 'form',
					labelWidth : 60,
					items : {
						fieldLabel : '备注说明',
						xtype : 'textarea',
						name : 'outTripApply.remark',
						width : 650,
						maxLength : 300
					}
				},
				{
					// 外出出差申请信息是否已删除(0：未删除、1：已删除、2：草稿)
					xtype : 'hidden',
					name : 'outTripApply.isDeleted',
					value : 0
				},
				{
					// 外出出差審批狀態(1：审批中、2：审批通过、3：重新申请(审批退回)、4：流程终止)
					xtype : 'hidden',
					name : 'outTripApply.applyState',
					value : 1
				},
				{
					// Panel3：附件部分
					layout : 'column',
					border : false,
					defaults : {
						border : false
					},
					items : [
						{
							columnWidth : .7,
							layout : 'form',
							labelWidth : 60,
							items : [
								{
									fieldLabel : '附件',
									xtype : 'panel',
									id : 'OutTripApplyWinForm.outTripAttachFilePanel',
									border : true,
									height : 80,
									autoScroll : true,
									html : ''
								}
							]
						},
						{
							columnWidth : .3,
							items : [
								{
									border : false,
									xtype : 'button',
									text : '添加附件',
									iconCls : 'menu-attachment',
									handler : function() {
										var dialog = App.createUploadDialog({
											file_cat : 'document',
											judge_size : 'no',
											callback : function(data) {
												var fileIds = Ext.getCmp("OutTripApplyWinForm.fileIds");
												var filePanel = Ext.getCmp('OutTripApplyWinForm.outTripAttachFilePanel');

												for ( var i = 0; i < data.length; i++) {
													if (fileIds.getValue() != '') {
														fileIds.setValue(fileIds.getValue() + ',');
													}
												
													fileIds.setValue(fileIds.getValue()+ data[i].fileId);

													Ext.DomHelper.append(
														filePanel.body,
														'<span><a href="#" onclick="FileAttachDetail.show('
														+ data[i].fileId
														+ ')">'
														+ data[i].filename
														+ '</a> <img class="img-delete" src="'
														+ __ctxPath
														+ '/images/system/delete.gif" onclick="removeFile(this,'
														+ data[i].fileId
														+ ')"/>&nbsp;|&nbsp;</span>'
													);
													
													Ext.getCmp('OutTripApplyWinForm.fileIdsHtml').setValue(
														Ext.getCmp('OutTripApplyWinForm.fileIdsHtml').getValue()
														+ '<span><a href="#" onclick="FileAttachDetail.show('
														+ data[i].fileId
														+ ')">'
														+ data[i].filename
														+ '</a> &nbsp;|&nbsp;</span>'
													);
												}
											}
										});
										dialog.show(this);
									}
								},
								{
									xtype : 'button',
									text : '清除附件',
									iconCls : 'reset',
									handler : function() {
										var filePanel = Ext.getCmp('OutTripApplyWinForm.outTripAttachFilePanel');
										var fileAttaches = Ext.getCmp("OutTripApplyWinForm.fileIds");

										filePanel.body.update('');
										fileAttaches.setValue('');
									}
								},
								{
									xtype : 'hidden',
									id : 'OutTripApplyWinForm.fileIds',
									name : 'fileIds'
								},
								{
									xtype : 'hidden',
									id : 'OutTripApplyWinForm.fileIdsHtml',
									name : 'OutTripApplyWinForm.fileIdsHtml'
								}
							]
						}
					]
				},
				{
					// 传递负责审批的部门领导ID至後台(Action)的变量
					name : 'nextFlowExaminerId',
					xtype : 'hidden'
				},
				{
					// 下拉选单 - 负责审批的部门领导
					columnWidth : 0.95,
					layout : 'form',
					labelWidth : 60,
					items : {
						xtype : "combo",
						name : "nextFlowExaminerName",
						id : "OutTripApplyWinForm.nextFlowExaminerName",
						fieldLabel : "负责审批的部门领导",
						valueField : 'flowAssignId',
						displayField : 'flowAssignName',
						mode : 'local',
						editable : false,
						typeAhead : true,
						triggerAction : 'all',
						allowBlank : false,
						store : comboStore,
						listeners : {
							select : function(cbo, record, index) {
								var fm = Ext.getCmp("OutTripApplyWinForm");
								fm.getCmpByName('nextFlowExaminerId').setValue(cbo.getValue());
							}
						}
					}
				}
			]
		});
		
		// Panel2：费用明细部分
		// 栏位架构部分
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(),
				{
						header : 'configKey',
						dataIndex : 'configKey',
						hidden : true
				},
				{
					header : '费用名目',
					dataIndex : 'feeItem',
					width : 30,
					editor : new Ext.form.TextField({
						allowBlank : false
					})
				},
				{
					header : '费用标准',
					dataIndex : 'feeCriterion',
					width : 30,
					editor : new Ext.form.NumberField({
						allowBlank : false,
						allowNegative : false,
						nanText : '请输入合法数字！',
						value : 0
					})
				},
				{
					header : '天数',
					dataIndex : 'dayAmount',
					width : 15,
					editor : new Ext.form.NumberField({
						allowBlank : false,
						allowNegative : false,
						nanText : '请输入合法数字！',
						value : 0,
						validator : this.CheckFeeAmount
					})
				},
				{
					header : '合计',
					dataIndex : 'feeAmount',
					width : 30,
					value : 0
				}
			],
			defaults : {
				sortable : true,
				menuDisabled : true,
				width : 100
			}
		});
		
		// Grid内容部分
		this.store = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
				url : __ctxPath + '/system/listSysConfig.do'
			}),
			reader : new Ext.data.JsonReader({
				root : 'result',
				totalProperty : 'totalCounts',
				fields : [
					{name : 'configKey'},
					{name : 'feeItem', mapping : 'configName' },
					{name : 'feeCriterion', mapping : 'dataValue' }
				]
			}),
			remoteSort : false
		});
		
		this.store.setDefaultSort('configKey', 'ASC');
		
		this.store.load({
			params : {
				'Q_typeKey_S_EQ' : 'outTripConfig',
				start : 0,
				limit : 10
			}
		});
		
		// Toolbar部分
		this.topbar = new Ext.Toolbar({
			id : 'OutTripApplyWinFormGridToolbar',
			height : 30,
			bodyStyle : 'text-align:right',
			menuAlign : 'center',
			items : []
		});
		
		this.topbar.add(new Ext.Button({
			iconCls : 'btn-add',
			text : '新增',
			scope : this,
			handler : function() {
				var recordType = this.store.recordType;
				this.store.add(new recordType());
			}
		}));
		
		this.topbar.add(new Ext.Button({
			iconCls : 'btn-del',
			text : '删除',
			scope : this,
			handler : function() {
				var grid = Ext.getCmp("OutTripApplyWinFormGrid");
				var selectRecords = grid.getSelectionModel().getSelections();
				if (selectRecords.length == 0) {
					Ext.MessageBox.show({
						title : '信息',
						msg : '请选择要删除的记录！',
						buttons : Ext.MessageBox.OK,
						icon : 'ext-mb-error'
					});
					return;
				}
				else {
					for (var i=0; i<selectRecords.length; i++) {
						this.store.remove(selectRecords[i]);
					}
				}
			}
		}));
		
		// 产生Grid部分
		this.gridPanel = new Ext.grid.EditorGridPanel({
			id : 'OutTripApplyWinFormGrid',
			region : 'center',
			tbar : this.topbar,
			store : this.store,
		    trackMouseOver : true,
			disableSelection : false,
			loadMask : true,
			clicksToEdit:1,
		    stripeRows:true,
			height : 150,
			cm : cm,
			sm : sm,
			viewConfig : {
				forceFit : true,
				autoFill : true
			}
		});
		
	},// 初始化界面控件 - 结束
	
	// 保存并启动申请流程 - 开始
	save : function(formPanel, window) {
		
		// 判断日期时间的正确性
		var fm = Ext.getCmp('OutTripApplyWinForm');
		/*var nowDate = new Date();
		if (fm.getCmpByName('outTripApply.tripSDt').getValue() < nowDate) {
			Ext.ux.Toast.msg('操作信息', '出差开始日期比实际日期小！');
			fm.getCmpByName('outTripApply.tripSDt').focus(true);
			return;
		}*/
		if (fm.getCmpByName('outTripApply.tripSDt').getValue() > fm.getCmpByName('outTripApply.tripEDt').getValue()) {
			Ext.ux.Toast.msg('操作信息', '出差开始日期不可大於出差结束日期！');
			fm.getCmpByName('outTripApply.tripSDt').focus(true);
			return;
		}
		
		// 取得费用明细(GridPanel)中的值
		var details = [];
		var gridPanel = Ext.getCmp('OutTripApplyWinFormGrid');
		if(gridPanel != null) {
			var store = gridPanel.getStore();
			for (var i = 0; i < store.getCount(); i++) {
				if(store.getAt(i).get('feeItem') == null) {
					Ext.ux.Toast.msg('操作信息', '费用名目是必填项!');
					return;
				}
				if(store.getAt(i).get('feeCriterion') == null) {
					Ext.ux.Toast.msg('操作信息', '费用标准是必填项!');
					return;
				}
				if(store.getAt(i).get('dayAmount') == null) {
					Ext.ux.Toast.msg('操作信息', '天数是必填项!');
					return;
				}
				
				// 合计 = 费用标准 x 人数 x 天数
				store.getAt(i).data.feeAmount = (store.getAt(i).get('feeCriterion')) * (store.getAt(i).get('dayAmount'));
				
				details.push(store.getAt(i).data);
			}
		}
		
		// 执行表单提交操作
		var defId = window.defId;
		
		if (formPanel.getForm().isValid()) {
			formPanel.getForm().submit({
				
				scope : this,
				url : __ctxPath + '/admin/saveOutTripApply.do',
				params : {
					details : Ext.encode(details)
				},
				method : 'post',
				waitMsg : '数据正在提交，请稍后...',
				success : function(fp, action) {
					if(fp != null) {
						var obj = Ext.decode(action.response.responseText);
						var outTripApplyId = obj.outTripApplyId;
						
						var applicantId = fm.getCmpByName('outTripApply.applicantId').getValue();
						var fieldApplicantId = fm.getCmpByName('fieldApplicantId').getValue();
						var className = fm.getCmpByName('comboClassId').getRawValue();
						var feeType = fm.getCmpByName('outTripApply.feeType').getValue();
						var feeTypeName = "";
						if(feeType == 0) feeTypeName = "不发生费用";
						else feeTypeName = "发生费用";
						var feeSupplier = fm.getCmpByName('outTripApply.feeSupplier').getValue();
						var tripSDt = fm.getCmpByName('outTripApply.tripSDt').getValue().dateFormat('Y-m-d H:i:s');
						var tripEDt = fm.getCmpByName('outTripApply.tripEDt').getValue().dateFormat('Y-m-d H:i:s');
						var site = fm.getCmpByName('outTripApply.site').getValue();
						var topic = fm.getCmpByName('outTripApply.topic').getValue();
						var description = fm.getCmpByName('outTripApply.description').getValue();
						var remark = fm.getCmpByName('outTripApply.remark').getValue();
						var nextFlowExaminerId = fm.getCmpByName('nextFlowExaminerId').getValue();
						
						// 附件
						var fileHtml = Ext.getCmp('OutTripApplyWinForm.fileIdsHtml').getValue();
						
						Ext.Ajax.request({
							url : __ctxPath + '/flow/saveProcessActivity.do',
							params:{
								defId : defId,
								// 负责审批的部门领导ID
								flowAssignId : nextFlowExaminerId,
								// 外出出差申请ID，供"重新填写申请表单"页面获取原数据。
								outTripApplyId : outTripApplyId,
								// 负责审批的部门领导ID，供"重新填写申请表单"页面获取原数据。
								depLeaderId : nextFlowExaminerId,
								// 申请人ID，供後续流程中审批拒绝时，引导流程回到申请人。
								applicantId : applicantId,
								// 部门领导审批阶段需带出的栏位信息
								fieldApplicantId : fieldApplicantId,
								className : className,
								feeTypeName : feeTypeName,
								feeSupplier : feeSupplier,
								tripSDt : tripSDt,
								tripEDt : tripEDt,
								site : site,
								topic : topic,
								description : description,
								remark : remark,
								// 附件
								fileHtml : fileHtml,
								//ccUserIds : ccPanel.getCmpByName('ccIds').getValue(),
								appUserDepId : curUserInfo.depId,
								// 启动工作流
								startFlow:true
							},
							success : function(resp, options){
								var proJson = resp.responseText;
								proJson = eval("("+ proJson + ")");					
								var processInsId = proJson.runId;
								
								// 更新流程ID至外出出差申请主表
								Ext.Ajax.request({
									url : __ctxPath + '/admin/saveProcessInsIdOutTripApply.do',
									params:{
										'outTripApply.id':outTripApplyId,
										'outTripApply.processRun.runId':processInsId
									},
									success : function(response, options){}
								});
								
								Ext.ux.Toast.msg('操作信息','启动外出出差申请成功！');
								// 更新列表页面的查询结果
								var gridPanel = Ext.getCmp('OutTripApplyGridPanel');
								if (gridPanel != null) {
									gridPanel.getStore().reload();
								}								
								// 关闭视窗
								window.close();
							},
							failure : function(fp, action) {
								Ext.MessageBox.show({
									title : '操作信息',
									msg : '信息保存出错，请联系管理员！',
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});
								// 关闭视窗
								window.close();
							}
						});
					}
					
					// 关闭视窗
					window.close();
				},
				failure : function(fp, action) {
					Ext.MessageBox.show({
						title : '操作信息',
						msg : '信息保存出错，请联系管理员！',
						buttons : Ext.MessageBox.OK,
						icon : 'ext-mb-error'
					});
					// 关闭视窗
					window.close();
				},
				again: function(fp, action) {
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
		
	},// 保存并启动申请流程 - 结束
	
	// 重置
	reset : function() {
		
		this.formPanel.getForm().reset();
		
	},
	
	// 取消(关闭视窗)
	cancel : function(window) {
		
		window.close();
		
	},
	
	// 自动计算费用合计
	CheckFeeAmount : function() {
		
		var gridPanel = Ext.getCmp('OutTripApplyWinFormGrid');
		if(gridPanel != null) {
			var store = gridPanel.getStore();
			for (var i = 0; i < store.getCount(); i++) {
				if(store.getAt(i).get('dayAmount') != null) {
					store.getAt(i).set('feeAmount', ((store.getAt(i).get('feeCriterion')) * (store.getAt(i).get('dayAmount'))));
				}
			}
		}
		
	}
	
});

/**
 * 删除附件
 */
function removeFile(obj, fileId) {
	
	var fileIds = Ext.getCmp('OutTripApplyWinForm').getCmpByName('fileIds');
	var value = fileIds.getValue();
	if (value.indexOf(',') < 0) {// 仅有一个附件
		fileIds.setValue('');
	}
	else {
		value = value.replace(',' + fileId, '').replace(fileId + ',', '');
		fileIds.setValue(value);
	}

	var el = Ext.get(obj.parentNode);
	el.remove();
	
};
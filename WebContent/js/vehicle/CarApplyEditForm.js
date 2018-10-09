CarApplyEditForm = Ext.extend(Ext.Window, {
	// 构造函数 - 开始
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件

		this.initUIComponents();
		CarApplyEditForm.superclass.constructor.call(this, {
					id : 'CarApplyEditForm',
					layout : 'form',
					items : [this.formPanel],
					modal : true,
					// height : 400,
					iconCls : 'menu-archive-draft',
					width : 800,
					maximizable : true,
					title : '重庆市交委用车申请单',
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
									Ext.getCmp('CarApplyEditForm').close();
								}
							}]
				});
	},// 构造函数 - 结束

	// 初始化界面控件 - 开始
	initUIComponents : function() {
		var tag = this.tag;
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			id : 'CarApplyEditFormPanel',
			frame : false,
			border : true,
			defaults : {
				width : 400,
				anchor : '98%,98%'
			},
			bodyStyle : 'padding-top:5px;padding-left:5px;',
			formId : 'CarApplyStartFormIdMy',
			defaultType : 'textfield',
			items : [{
						fieldLabel : '申请人',
						name : 'carApply.proposer',
						id : 'proposer',
						xtype : 'hidden'
					}, {
						fieldLabel : '申请人',
						name : 'carApply.operatorId',
						id : 'operatorId',
						xtype : 'hidden'
					}, {
						name : 'carApply.applyId',
						id : 'applyId',
						xtype : 'hidden',
						value : this.applyId == null ? '' : this.applyId
					}, {
						name : 'appUserId',
						id : 'appUserId',
						xtype : 'hidden'
					}, {
						name : 'carApply.userId',
						id : 'userId',
						xtype : 'hidden'
					}, {
						name : 'departmentId',
						id : 'departmentId',
						xtype : 'hidden',
						value : curUserInfo.depId
					}, {
						xtype : 'container',
						style : 'padding-left:0px;margin-bottom:4px;',
						id : 'depContainer',
						layout : 'column',
						items : [{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '用车部门:',
									width : 105
								}, {
									xtype : 'textfield',
									name : 'carApply.department',
									id : 'department',
									allowBlank : false,
									editable : false,
									readOnly : true,
									width : 320
								}, {
									xtype : 'button',
									iconCls : 'btn-dep-sel',
									text : '选择部门',
									handler : function() {
										DepSelector2.getView(
												function(id, name) {
													Ext.getCmp('department')
															.setValue(name);
													Ext.getCmp('departmentId')
															.setValue(id);
												}, true).show();
									}
								}, {
									xtype : 'button',
									text : '清除记录',
									style : 'padding-left:5px',
									iconCls : 'reset',
									handler : function() {
										Ext.getCmp('department').setValue('');
										Ext.getCmp('departmentId').setValue('');
									}
								}, {
									xtype : 'button',
									style : 'padding-left:5px',
									text : '车况参考',
									iconCls : 'btn-car',
									handler : function() {
										CarReferSelector.getView().show();
									}
								}, {
									xtype : 'button',
									style : 'padding-left:5px',
									text : '重新派车',
									iconCls : 'btn-car',
									hidden : this.tag == 'edits' ? true : false,
									scope : this,
									handler : this.edit
											.createCallback(this.applyId)
								}]
					}, {
						xtype : 'container',
						style : 'padding-left:0px;margin-bottom:4px;',
						layout : 'column',
						items : [{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '用车人:',
									width : 105
								}, {
									xtype : 'textfield',
									name : 'carApply.userFullname',
									id : 'userFullname',
									allowBlank : false,
									editable : false,
									readOnly : true,
									width : 320
								}, {
									xtype : 'button',
									iconCls : 'btn-user-sel',
									text : '选择人员',
									handler : function() {
										var depId = Ext.getCmp('departmentId')
												.getValue();
										DeptOfUserSelector.getView(
												function(id, name) {
													Ext.getCmp('userFullname')
															.setValue(name);
												}, false, null, depId).show();

									}
								}, {
									xtype : 'button',
									text : '清除记录',
									style : 'padding-left:5px',
									iconCls : 'reset',
									handler : function() {
										Ext.getCmp('userFullname').setValue('');
									}
								}]
					}, {
						fieldLabel : '用车人数',
						name : 'carApply.peopleAmount',
						id : 'peopleAmount',
						allowBlank : false,
						xtype : 'numberfield'
					}, {
						fieldLabel : '原因',
						name : 'carApply.reason',
						id : 'reason',
						allowBlank : false,
						xtype : 'textarea'
					}, {
						fieldLabel : '用车时间',
						name : 'carApply.startTime',
						id : 'startTime',
						xtype : 'datetimefield',
						format : 'Y-m-d H:i',
						// value:new Date(),
						allowBlank : false,
						editable : false
					}, {
						fieldLabel : '结束时间',
						name : 'carApply.endTime',
						id : 'endTime',
						allowBlank : false,
						editable : false,
						xtype : 'datetimefield',
						format : 'Y-m-d H:i'
					}, {
						fieldLabel : '到达地点',
						allowBlank : false,
						name : 'carApply.toSite',
						id : 'toSite'
					}, {

						fieldLabel : '审批状态',
						hiddenName : 'carApply.approvalStatus',
						id : 'approvalStatus',
						mode : 'local',
						xtype : 'combo',
						allowBlank : false,
						readOnly : true,
						disabled : (curUserInfo.isCarAdmin || curUserInfo.isAdmin)
								? false
								: true,
						editable : false,
						triggerAction : 'all',
						store : [['1', '新申请'], ['2', '审批之中'], ['3', '批准用车'],
								['5', '用车完成'], ['4', '取消申请']]

					}, {
						fieldLabel : '备注',
						name : 'carApply.notes',
						id : 'notes',
						xtype : 'textarea',
						value : ' '
					}, {
						name : 'departflowAssignStartId',
						id : 'departflowAssignStartId',
						xtype : 'hidden'
					}, {
						xtype : 'hidden',
						id : 'carApplytags',
						value : tag
					}, {
						name : 'carApply.carNo',
						id:'CarApplyEditFormPanel.carNo',
						xtype : 'hidden'
					}, {

						name : 'carApply.driver',
						id:'CarApplyEditFormPanel.driver',
						xtype : 'hidden'
					}]
		});// end of the formPanel
		if (this.applyId != null && this.applyId != 'undefined') {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/admin/getCarApply.do?applyId='
						+ this.applyId,
				waitMsg : '正在载入数据...',
				success : function(form, action) {
                Ext.getCmp('CarApplyEditFormPanel.carNo').setValue(action.result.data.carNo);
               Ext.getCmp('CarApplyEditFormPanel.driver').setValue(action.result.data.driver);
					var endTime = action.result.data.endTime;
					var startTime = action.result.data.startTime;
					// alert(Date.parseDate(endTime,'Y-m-d H:i'))
					if (startTime != null && startTime != '') {
						Ext.getCmp('startTime').setValue(startTime);
					}
					if (endTime != null && endTime != '') {
						Ext.getCmp('endTime').setValue(endTime);
					}
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
		var fp = Ext.getCmp('CarApplyEditFormPanel');
		// var applyId = null;
		if (fp.getForm().isValid()) {
			var t = Ext.getCmp('carApplytags').getValue();
			var startTime = Ext.util.Format.date(Ext.getCmp("startTime")
							.getValue(), 'Y-m-d H:i');
			var endTime = Ext.util.Format.date(
					Ext.getCmp("endTime").getValue(), 'Y-m-d H:i');
			if (startTime >= endTime) {
				Ext.MessageBox.show({
							title : '操作信息',
							msg : '用车时间应小于结束时间！',
							buttons : Ext.MessageBox.OK,
							icon : 'ext-mb-error'
						});
			}
			var pro = Ext.getCmp('approvalStatus').getValue();
			if (pro == "1" || pro == "2") {
				Ext.getCmp("CarApplyEditFormPanel.carNo").setValue("");
				Ext.getCmp("CarApplyEditFormPanel.driver").setValue("");
				fp.getForm().submit({
					url : __ctxPath + '/admin/saveCarFlowCarApply.do',
					params : {
						startTime : Ext.util.Format.date(Ext
										.getCmp("startTime").getValue(),
								'Y-m-d H:i'),
						endTime : Ext.util.Format.date(Ext.getCmp("endTime")
										.getValue(), 'Y-m-d H:i')
					},
					method : 'post',
					waitMsg : '正在提交数据...',
					success : function(fp, action) {
						var defId = FlowDefIdPro.vehicleApplyId;
						var rollFileObj = Ext
								.decode(action.response.responseText);
						var nextApplyId = rollFileObj.applyId;
						var department = Ext.getCmp('department').getValue();
						var departmentId = Ext.getCmp('departmentId')
								.getValue();
						var userFullname = Ext.getCmp('userFullname')
								.getValue();
						var peopleAmount = Ext.getCmp('peopleAmount')
								.getValue();
						var reason = Ext.getCmp('reason').getValue();
						var startDate = Ext.getCmp('startTime').getValue();
						var startT = Ext.util.Format.date(startDate,
								'Y-m-d H:i');
						var endDate = Ext.getCmp('endTime').getValue();
						var endT = Ext.util.Format.date(endDate, 'Y-m-d H:i');
						var toSite = Ext.getCmp('toSite').getValue();
						var notes = Ext.getCmp('notes').getValue();
						var userId = Ext.getCmp('appUserId').getValue();
						if (fp != null) {
							var myMask = new Ext.LoadMask(Ext.getBody(), {
								msg : '正在提交处理，请稍等！',
								removeMask : true
									// 完成后移除
								});
							myMask.show();
							Ext.Ajax.request({
								url : __ctxPath
										+ '/flow/saveProcessActivity.do',
								params : {
									defId : defId,
									department : department,
									departmentId : departmentId,
									userFullname : userFullname,
									reason : reason,
									peopleAmount : peopleAmount,
									startDate : startT,
									endDate : endT,
									toSite : toSite,
									notes : notes,
									approvalStatus : 2,
									acceptId : nextApplyId,
									userId : userId,
									startFlow : true
								},
								success : function(resp, options) {
									myMask.hide();
									var proJson = resp.responseText;
									proJson = eval("(" + proJson + ")");
									var processInsId = proJson.runId;
									Ext.Ajax.request({
										url : __ctxPath
												+ '/admin/saveCarFlowCarApply.do',
										params : {
											'carApply.applyId' : nextApplyId,
											'carApply.processRun.runId' : processInsId,
											startTime : Ext.util.Format.date(
													Ext.getCmp("startTime")
															.getValue(),
													'Y-m-d H:i'),
											endTime : Ext.util.Format.date(Ext
															.getCmp("endTime")
															.getValue(),
													'Y-m-d H:i')
										},
										success : function(response, options) {
										}
									});
									Ext.ux.Toast.msg('操作信息', '成功启动车辆流程申请');
									var tabPanel = Ext.getCmp('centerTabPanel');

									tabPanel.remove(Ext
											.getCmp('ProcessRunStart' + defId));
									// 刷新列表窗口
									Ext.getCmp('CarApplyEditForm').close();
									if (Ext.getCmp('VehicleUsingAssignGrid') != null) {
										Ext.getCmp('VehicleUsingAssignGrid')
												.getStore().reload();
									}
									if (Ext.getCmp('VehicleApplyAssignGrid') != null) {
										Ext.getCmp('VehicleApplyAssignGrid')
												.getStore().reload();
									}
									refreshTaskPanelView();
								}
							});
						}
					},
					failure : function(fp, action) {
						Ext.MessageBox.show({
									title : '操作信息',
									msg : '信息保存出错，请联系管理员！',
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});

						Ext.getCmp('CarApplyStartFormWinMy').close();
					}
				});
			} else if (pro == "4") {
				Ext.Ajax.request({
							url : __ctxPath + '/admin/multiDelCarApply.do',
							params : {
								ids : this.applyId
							},
							method : 'post',
							success : function() {
								Ext.getCmp('CarApplyEditForm').close();
								var VehicleUsingAssignGrid = Ext
										.getCmp('VehicleUsingAssignGrid');
								var WaitApplyGrid = Ext.getCmp('WaitApplyGrid');
								var VehicleApplyAssignGrid = Ext
										.getCmp('VehicleApplyAssignGrid');
								if (VehicleUsingAssignGrid != null) {
									VehicleUsingAssignGrid.getStore().reload();
								}
								if (WaitApplyGrid != null) {
									WaitApplyGrid.getStore().reload();
								}
								if (VehicleApplyAssignGrid != null) {
									VehicleApplyAssignGrid.getStore().reload();
								}
							}
						})
			} else {
				fp.getForm().submit({
					url : __ctxPath + '/admin/saveCarFlowCarApply.do',
					params : {
						startTime : Ext.util.Format.date(Ext
										.getCmp("startTime").getValue(),
								'Y-m-d H:i'),
						endTime : Ext.util.Format.date(Ext.getCmp("endTime")
										.getValue(), 'Y-m-d H:i')
					},
					method : 'post',
					waitMsg : '正在提交数据...',
					success : function(fp, action) {
						Ext.ux.Toast.msg('提示', '修改成功！');
						Ext.getCmp('CarApplyEditForm').close();
						var VehicleUsingAssignGrid = Ext
								.getCmp('VehicleUsingAssignGrid');
						var WaitApplyGrid = Ext.getCmp('WaitApplyGrid');
						var VehicleApplyAssignGrid = Ext
								.getCmp('VehicleApplyAssignGrid');
						if (VehicleUsingAssignGrid != null) {
							VehicleUsingAssignGrid.getStore().reload();
						}
						if (WaitApplyGrid != null) {
							WaitApplyGrid.getStore().reload();
						}
						if (VehicleApplyAssignGrid != null) {
							VehicleApplyAssignGrid.getStore().reload();
						}
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
	},
	edit : function(id) {
		new AgainCarApplyForm({
					applyId : id,
					starttime : Ext.util.Format.date(Ext.getCmp('startTime')
									.getValue(), 'Y-m-d H:i'),
					endtime : Ext.util.Format.date(Ext.getCmp('endTime')
									.getValue(), 'Y-m-d H:i')
				}).show();
	}
})
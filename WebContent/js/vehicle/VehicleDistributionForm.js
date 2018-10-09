/**
 * @author
 * @createtime
 * @class VehicleDistributionForm
 * @extends Ext.Window
 * @description VehicleDistributionForm表单
 * @company 宏天软件
 */
VehicleDistributionForm = Ext.extend(Ext.Window, {

	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		var com = null;
		// 必须先初始化组件
		this.initUIComponents();

		VehicleDistributionForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'VehicleDistributionFormWin',
					title : '车辆分配详细信息',
					iconCls : 'menu-car_apply',
					width : 600,
					height : 600,
					minWidth : 599,
					minHeight : 479,
					items : this.formPanel,
					maximizable : true,
					border : false,
					modal : true,
					plain : true,
					buttonAlign : 'center',
					buttons : this.buttons
				});

	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {

		this.formPanel = new Ext.FormPanel({
					url : __ctxPath + '/admin/saveCarApply.do',
					layout : 'form',
					id : 'VehicleDistributionForm',
					frame : false,
					border : true,
					defaults : {
						width : 400,
						anchor : '98%,98%'
					},
					bodyStyle : 'padding-top:5px;padding-left:5px;',
					formId : 'VehicleDistributionFormId',
					defaultType : 'textfield',
					items : [{
								name : 'carApply.applyId',
								id : 'applyId',
								xtype : 'hidden',
								value : this.applyId == null
										? ''
										: this.applyId
							}, {
						
						name:'carApply.approvalStatus',
						id : 'approvalStatus',
						xtype : 'hidden'
					},{
					
						xtype : 'hidden',
						name:'carApply.ishavecardriver',
						id : 'ishavecardriver'
					},{
						xtype : 'hidden',
						id : 'iseffective',
						name:'carApply.iseffective'
					},	{
								xtype : 'hidden',
								id : 'carIds',
								name : 'carApply.carIds'
							}, {
								xtype : 'hidden',
								id : 'userId',
								name : 'carApply.userId',
								value : curUserInfo.userId
							}, {
								xtype : 'hidden',
								id : 'applyDate',
								name : 'carApply.applyDate'
							}, {
								xtype : 'hidden',
								id : 'carIds',
								name : 'carApply.carIds'
							}, {
								xtype : 'container',
								layout : 'column',
								id : 'checkCar',
								style : 'padding-left:0px;margin-bottom:4px;',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '车牌号码:',
											width : 105
										}, {
											xtype : 'textfield',
											name : 'carApply.carNo',
											id : 'carNo',
											editable : false,
											// allowBlank : false,
											readOnly : true,
											width : 320
										}, {
											xtype : 'button',
											iconCls : 'btn-car',
											text : '选择车辆',
											handler : function() {
												CarUseSelector
														.getView(
																function(id,
																		name) {
																	Ext
																			.getCmp('carNo')
																			.setValue(name);
																	Ext
																			.getCmp('carIds')
																			.setValue(id);
																},
																false,
																Ext
																		.getCmp('startTime')
																		.getValue(),
																Ext
																		.getCmp('endTime')
																		.getValue())
														.show();
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
										}]
							}, {
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
											width : 320
										}, {
											xtype : 'button',
											iconCls : 'btn-car',
											text : '选择司机',
											handler : function() {
												CarDriverSelector
														.getView(
																function(id,
																		name) {
																	Ext
																			.getCmp('driver')
																			.setValue(name);
																	Ext
																			.getCmp('driverIds')
																			.setValue(id);
																},
																false,
																Ext
																		.getCmp('startTime')
																		.getValue(),
																Ext
																		.getCmp('endTime')
																		.getValue())
														.show();
											}
										}, {
											xtype : 'button',
											text : '清除记录',
											iconCls : 'reset',
											handler : function() {
												Ext.getCmp('driver')
														.setValue('');

											}
										}]
							}, {

								fieldLabel : '用车部门',
								xtype : 'textfield',
								name : 'carApply.department',
								id : 'department',
								value : curUserInfo.depName,
								allowBlank : false,
								editable : false,
								readOnly : true,
								width : 320

							}, {

								fieldLabel : '用车人',
								xtype : 'textfield',
								name : 'carApply.userFullname',
								id : 'userFullname',
								value : curUserInfo.fullname,
								allowBlank : false,
								editable : false,
								readOnly : true,
								width : 320

							},

							{

								fieldLabel : '申请人',
								xtype : 'textfield',
								name : 'carApply.proposer',
								id : 'proposer',
								editable : false,
								allowBlank : false,
								readOnly : true,
								width : 320

							}, {
								fieldLabel : '原因',
								name : 'carApply.reason',
								id : 'reason',
								allowBlank : false,
								readOnly : true,
								xtype : 'textarea'
							}, {
								fieldLabel : '用车时间',
								name : 'carApply.startTime',
								id : 'startTime',
								xtype : 'datetimefield',
								format : 'Y-m-d H:i:s',
								allowBlank : true,
								readOnly : true,
								editable : false
							}, {
								fieldLabel : '结束时间',
								name : 'carApply.endTime',
								id : 'endTime',
								allowBlank : true,
								readOnly : true,
								xtype : 'datetimefield',
								format : 'Y-m-d H:i:s'
							},
							{
								fieldLabel : '出发地点',
								name : 'carApply.fromSite',
								id : 'fromSite',
								readOnly : true
							}, {
								fieldLabel : '到达地点',
								name : 'carApply.toSite',
								id : 'toSite',
								readOnly : true
							}, {
								fieldLabel : '承载人数',
								name : 'carApply.peopleAmount',
								id : 'peopleAmount',
								readOnly : true,
								xtype : 'numberfield'
							},

							{
								fieldLabel : '备注',
								name : 'carApply.notes',
								id : 'notes',
								readOnly : true,
								xtype : 'textarea'
							}, {
								fieldLabel : '资源状态',
								hiddenName : 'status',
								id : 'status',
								xtype : 'combo',
								mode : 'local',
								allowBlank : false,
								editable : false,
								triggerAction : 'all',
								value : '1',
								store : [['1', '有'], ['2', '没有']],
								listeners : {
									scope : this,
									'select' : function(combo, record, index) {
										if (index == '0') {
											Ext.getCmp('checkCar').show();
											Ext.getCmp('checkDriver').show();
											Ext.getCmp('carNo').allowBlank = false;
											Ext.getCmp('driver').allowBlank = false;
										}
										if (index == '1') {
											Ext.getCmp('checkCar').hide();
											Ext.getCmp('checkDriver').hide();
											Ext.getCmp('carNo').allowBlank = true;
											Ext.getCmp('driver').allowBlank = true;
										}

									}
								}

							}

					]
				});// end of the formPanel
		if (this.applyId != null && this.applyId != 'undefined') {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/admin/getCarApply.do?applyId='
						+ this.applyId,
				waitMsg : '正在载入数据...',
				success : function(form, action) {
					Ext.getCmp('applyDate')
							.setValue(action.result.data.applyDate);
				/*	Ext.getCmp('startTime')
							.setValue(new Date(getDateFromFormat(
									action.result.data.startTime,
									"yyyy-MM-dd HH:mm")));*/

				/*	var endTime = action.result.data.endTime;
					if (endTime != null && endTime != '') {
						Ext.getCmp('endTime')
								.setValue(new Date(getDateFromFormat(endTime,
										"yyyy-MM-dd HH:mm")));
					}*/
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('编辑', '载入失败');
				}
			});

		};// end of the load formPanel

		this.buttons = [{
			
			text : '保存',
			iconCls : 'btn-save',
			handler : function() {
				Ext.getCmp('approvalStatus')
							.setValue('3');
							Ext.getCmp('ishavecardriver')
							.setValue('1');
							Ext.getCmp('iseffective')
							.setValue('2');
				var fp = Ext.getCmp('VehicleDistributionForm');
				if (fp.getForm().isValid()) {
					fp.getForm().submit({
						method : 'post',
						waitMsg : '正在提交数据...',
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '成功保存信息！');
							Ext.getCmp('VehicleApplyGrid').getStore()
									.reload();
							Ext.getCmp('VehicleDistributionFormWin').close();

						},
						failure : function(fp, action) {
							var resultResp = Ext.util.JSON
									.decode(action.response.responseText);
							if (resultResp.result == 1) {
								Ext.MessageBox.show({
											title : '操作信息',
											msg : '开始时间不能大于结束时间！',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});
							} else if (resultResp.result == 2) {
								Ext.MessageBox.show({
											title : '操作信息',
											msg : '车辆和司机数量不对！',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});
							} else {
								Ext.MessageBox.show({
											title : '操作信息',
											msg : '信息保存出错，请联系管理员！',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});
							}
							Ext.getCmp('VehicleDistributionFormWin').close();
						}
					});
				}
			}
		}, {
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				Ext.getCmp('VehicleDistributionFormWin').close();
			}
		}];// end of the buttons

	}// end of the initUIComponents

});

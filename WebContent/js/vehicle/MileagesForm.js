MileagesForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		MileagesForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'MileagesFormWin',
					title : '添加里程',
					iconCls : 'menu-product',
					width : 550,
					height : 300,
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
		var lastEndNumber = -1;
		function getLastMileage() {
			Ext.getCmp('endNumber').setValue("")
			var cid = Ext.getCmp('carId').getValue();
			var dt = Ext.getCmp('travelDate').getValue();
			if (cid && dt) {
				var myMask = new Ext.LoadMask(fp.getEl(), {
							removeMask : true,
							msg : "正在获取上月里程..."
						});
				myMask.show();
				Ext.Ajax.request({
							url : __ctxPath + '/mileages/listMileages.do',
							params : {
								'Q_car.carid_L_EQ' : cid,
								'Q_travelDate_D_GT' : dt.add(Date.MONTH, -2)
										.format('Y-m-d'),// >
								'Q_travelDate_D_LT' : dt.format('Y-m-d')
								// <
							},
							success : function(response, options) {
								myMask.hide();
								var resultResp = Ext.decode(response.responseText);
								if(resultResp.result.length>0){
									lastEndNumber = resultResp.result[0].endNumber;
								}else{
									lastEndNumber = -1;
								}
							},
							failure : function() {
								lastEndNumber = -1;
								myMask.hide();
							}
						});
			}
		}
		// 初始化form表单
		var fp = this.formPanel = new Ext.FormPanel({
					url : __ctxPath + '/mileages/saveMileages.do',
					layout : 'form',
					id : 'MileagesForm',
					bodyStyle : 'padding:5px;',
					frame : false,
					defaults : {
						width : 400,
						anchor : '98%,98%'
					},
					defaultType : 'textfield',
					items : [{
								xtype : 'hidden',
								name : 'mileages.id',
								id : 'id'
							}, {
								xtype : 'hidden',
								name : 'mileages.carId',
								id : 'carId'
							}, {
								xtype : 'container',
								layout : 'hbox',
								layoutConfigs : {
									align : 'middle'
								},
								defaults : {
									margins : '0 2 0 0'
								},
								height : 26,
								items : [{
											xtype : 'label',
											text : '车牌号码:',
											width : 103
										}, {
											id : 'carno',
											xtype : 'textfield',
											name : 'carno',
											editable : false,
											readOnly : true,
											allowBlank : false,
											width : 130
										}, {
											xtype : 'button',
											iconCls : 'btn-car',
											text : '选择车辆',
											handler : function() {
												CarSelector.getView(
														function(id, name) {
															Ext
																	.getCmp('carId')
																	.setValue(id);
															Ext
																	.getCmp('carno')
																	.setValue(name);
															getLastMileage();
														}, true

												).show();
											}

										}, {
											xtype : 'button',
											text : '消除记录',
											iconCls : 'reset',
											handler : function() {
												Ext.getCmp('carId')
														.setValue('');
												Ext.getCmp('carno')
														.setValue('');
											}
										}]
							}, {
								fieldLabel : '日期',
								xtype : 'datefield',
								name : 'mileages.travelDate',
								format : 'Y-m-d',
								maxValue : new Date().getFirstDateOfMonth(),
								disabledDates  : [new Date().getFirstDateOfMonth()],
								id : 'travelDate',
								allowBlank : false,
								height : 120,
								listeners : {
									select : function() {
										getLastMileage();
									}
								}
							}, {
								fieldLabel : '里程表止数',
								name : 'mileages.endNumber',
								xtype : 'numberfield',
								id : 'endNumber',
								listeners : {
									blur : function() {
										if (lastEndNumber == -1) {
											Ext.Msg.alert('提示',
													'无上月里程数据,请手动填写本月里程！');
										} else {
											Ext.getCmp('monthMileage')
													.setValue(this.getValue()
															- lastEndNumber)
										}
									}
								}
							}, {
								fieldLabel : '本月里程',
								name : 'mileages.monthMileage',
								xtype : 'numberfield',
								id : 'monthMileage'
							}]
				});
		if (this.Id != null && this.Id != 'undefined') {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/mileages/getMileages.do?Id=' + this.Id,
				waitMsg : '正在载入数据...',
				success : function(form, action) {
					var result = action.result.data;
					var data = eval("(" + action.response.responseText + ")").data;
					Ext.getCmp('carno').setValue(action.result.data.car.carno);
					Ext.getCmp('travelDate')
							.setValue(new Date(data.travelDate));
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('编辑', '载入失败');
				}
			});
		}
		this.buttons = [{
			text : '保存',
			iconCls : 'btn-save',
			handler : function() {
				var fp = Ext.getCmp('MileagesForm');
				if (fp.getForm().isValid()) {
				 var month = Ext.getCmp("monthMileage").getValue();
				 var endnumber = Ext.getCmp("endNumber").getValue();
							if (month > endnumber) {
								Ext.MessageBox.show({
											title : '操作信息',
											msg : '本月里程应小于总里程！',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});
								return;
							}
					fp.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									Ext.getCmp('MileagesGrid').getStore()
											.reload();
									Ext.getCmp('MileagesFormWin').close();
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
				Ext.getCmp('MileagesFormWin').close();
			}
		}];// end of the buttons
	}// end of the initUIComponents
});
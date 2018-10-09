CarCostRecordForm = Ext.extend(Ext.Window, {

	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		CarCostRecordForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'CarCostRecordFormWin',
					title : '添加费用记录',
					width : 900,
					height : 400,
					tbar : this.topBar,
					items : this.formPanel,
					// items:this.gridPanel,
					border : false,
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		var addMode2 = this.detailsId;
		var addMode = this.tag;
		var store = new Ext.data.Store({

					proxy : new Ext.data.HttpProxy({
								url : __ctxPath
										+ '/admin/listCarCostRecordDetail.do?recordId='
										+ this.id
							}),
					remoteSort : false
				});

		var sm = new Ext.grid.CheckboxSelectionModel();
		
		this.formPanel = new Ext.FormPanel({
					constrain : true,
					layout : 'fit',
					border : false,
					id : 'CarCostRecordFormPanel',
					items : {
						xtype : 'tabpanel',
						activeTab : 0,
						itemId : 'tabPanel'
					}

				});// end of the formPanel

		tabPanel = this.formPanel.getComponent('tabPanel');
		tabPanel.add({
			title : '基本',
			layout : 'form',
			id : 'CarCostForm',
			bodyStyle : 'padding:5px;',
			// frame : false,
			// formId : 'LawsFormId',
			defaultType : 'textfield',
			items : [{
				xtype : 'container',
				style : 'padding-top:3px;',
				layout : 'column',
				height : 40,
				items : [{
							name : 'carCostRecord.id',
							id : 'id',
							xtype : 'hidden',
							value : this.id == null ? '' : this.id
						}, {
							xtype : 'hidden',
							id : 'car.carid',
							name : 'carCostRecord.car.carid'
						}, {
							xtype : 'label',
							style : 'padding-left:0px;',
							text : '车牌号码:',
							width : '10%'
						}, {
							xtype : 'textfield',
							name : 'carCostRecord.car.carno',
							id : 'car.carno',
							editable : false,
							allowBlank : false,
							readOnly : true,
							width : '20%'
						}, {
							hidden : addMode2 ? true : false,
							xtype : 'button',
							iconCls : 'btn-car',
							text : '选择车辆',
							handler : function() {
								CarAllSelector.getView(function(id, name) {
									Ext.getCmp('car.carno')
											.setValue(name);
									Ext.getCmp('car.carid')
											.setValue(id);
								}, true).show();
							}
						}, {
							xtype : 'label',
							style : 'padding-left:30px;',
							text : '日期:',
							width : '10%'
						}, {
							readOnly : addMode2 ? true : false,
							editable : false,
							xtype : 'datefield',
							name : 'carCostRecord.costDate',
							format : 'Y-m-d',
							id : 'costDate',
							width : 270,
							allowBlank : false
						}]
			}, {
				xtype : 'container',
				style : 'padding-top:3px;',
				layout : 'column',
				height : 40,
				items : [{
							xtype : 'hidden',
							id : 'carDriver.id',
							name : 'carCostRecord.carDriver.id'
						}, {
							xtype : 'label',
							style : 'padding-left:0px;',
							text : '经办人:',
							width : '10%'
						}, {
							xtype : 'textfield',
							name : 'carCostRecord.carDriver.name',
							id : 'carDriver.name',
							editable : false,
							allowBlank : false,
							readOnly : true,
							width : '20%'
						}, {
							hidden : addMode2 ? true : false,
							xtype : 'button',
							iconCls : 'btn-car',
							text : '选择经办人',
							handler : function() {
								CarAllDriverSelector.getView(
										function(id, name) {
											Ext
													.getCmp('carDriver.name')
													.setValue(name);
											Ext
													.getCmp('carDriver.id')
													.setValue(id);
										}, true).show();
							}
						}, {
							xtype : 'hidden',
							id : 'costType.id',
							name : 'carCostRecord.costType.id'
						}, {
							xtype : 'label',
							style : 'padding-left:20px;',
							text : '费用类别:',
							width : '10%'
						}, {
							readOnly : true,
							xtype : 'textfield',
							name : 'carCostRecord.costType.costTypeName',
							id : 'costType.costTypeName',
							width : 200,
							allowBlank : false
						}, {
							hidden : addMode2 ? true : false,
							xtype : 'button',
							iconCls : 'btn-car',
							text : '选择类别',
							handler : function() {
								CarCostTypeSelector.getView(
										function(id, costTypeName) {
											Ext
													.getCmp('costType.costTypeName')
													.setValue(costTypeName);
											Ext
													.getCmp('costType.id')
													.setValue(id);
										}, true).show();
							}
						}]
			}, {
				xtype : 'container',
				style : 'padding-top:3px;',
				layout : 'column',
				height : 40,
				items : [{
							xtype : 'label',
							text : '数量:',
							width : '10%'
						}, {
							readOnly : addMode2 ? true : false,
							xtype : 'numberfield',
							name : 'carCostRecord.itemQty',
							id : 'itemQty',
							width : '30%',
							listeners : {
								'change' : function() {
									if (Ext.getCmp('itemQty').getValue() != ''
											&& Ext.getCmp('unitPrice').getValue() != '') {
										var v = Ext.getCmp('itemQty').getValue()
												* Ext.getCmp('unitPrice').getValue();
										var m = Ext.util.Format.number(v,'0.00');
										Ext.getCmp('totalAmt').setValue(m);
									}
								}
							}
						}, {
							xtype : 'label',
							style : 'padding-left:20px;',
							text : '单价金额:',
							width : '10%'
						}, {
							readOnly : addMode2 ? true : false,
							xtype : 'numberfield',
							name : 'carCostRecord.unitPrice',
							id : 'unitPrice',
							width : '30%',
							listeners : {
								'change' : function() {
									if (Ext.getCmp('itemQty').getValue() != ''
											&& Ext.getCmp('unitPrice').getValue() != '') {
										var v = Ext.getCmp('itemQty').getValue()
												* Ext.getCmp('unitPrice').getValue();
										var m = Ext.util.Format.number(v,'0.00');
										Ext.getCmp('totalAmt').setValue(m);
									}
								}
							}
						}]
			}, {
				xtype : 'container',
				style : 'padding-top:3px;',
				layout : 'column',
				height : 40,
				items : [{
							xtype : 'label',
							text : '总金额:',
							width : '10%'
						}, {
							xtype : 'numberfield',
							// readOnly : true,
							name : 'carCostRecord.totalAmt',
							id : 'totalAmt',
							width : '30%',
							decimalPrecision : 2

						}]
			}, {
				xtype : 'container',
				style : 'padding-top:3px;',
				layout : 'column',
				height : 100,
				items : [{
							xtype : 'label',
							text : '备注:',
							width : '10%'
						}, {
							readOnly : addMode2 ? true : false,
							xtype : 'textarea',
							name : 'carCostRecord.costComment',
							id : 'costComment',
							width : 650
						}]
			}]
		}).show();

		if (this.id) {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/admin/getCarCostRecord.do?id=' + this.id,
				waitMsg : '正在载入数据...',
				success : function(form, action) {
					store.load();
					// Ext.getCmp('laws.lawsAuthor.authorId').hidden = true;
					var data = eval("(" + action.response.responseText + ")").data;
					Ext.getCmp('car.carid')
							.setValue(data.car.carid);
					Ext.getCmp('car.carno')
							.setValue(data.car.carno);
					Ext.getCmp('costDate')
							.setValue(new Date(data.costDate).format('Y-m-d'));
					Ext.getCmp('carDriver.name')
							.setValue(data.carDriver.name);
					Ext.getCmp('carDriver.id')
							.setValue(data.carDriver.id);
					Ext.getCmp('costType.costTypeName')
							.setValue(data.costType.costTypeName);
					Ext.getCmp('costType.id')
							.setValue(data.costType.id);
				
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('编辑', '载入失败');
				}
			});
		}

		this.buttons = [{
			hidden : addMode2 ? true : false,
			text : '保存',
			iconCls : 'btn-save',
			handler : function() {
				var totalPrice = 0;
					var fp = Ext.getCmp('CarCostRecordFormPanel');
					if (fp.getForm().isValid()) {
						fp.getForm().submit({
							url : __ctxPath + '/admin/saveCarCostRecord.do',
							method : 'post',
							waitMsg : '正在提交数据...',
							success : function(fp, action) {
								Ext.ux.Toast.msg('操作信息', '成功保存信息！');
								Ext.getCmp('carCostRecordGrid').getStore()
										.reload();
								Ext.getCmp('CarCostRecordFormWin').close();
							},
							failure : function(fp, action) {
								Ext.MessageBox.show({
											title : '操作信息',
											msg : '信息保存出错，请检查数据！',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});

							}
						});
					}
				//}

			}
		}, {
			// hidden : addMode2 ? true : false,
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				Ext.getCmp('CarCostRecordFormWin').close();
			}
		}];//

	}// end of the initUIComponents
});

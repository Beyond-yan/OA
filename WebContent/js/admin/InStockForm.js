/**
 * @author
 * @createtime
 * @class InStockForm
 * @extends Ext.Window
 * @description InStockForm表单
 * @company 宏天软件
 */
InStockForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		InStockForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'InStockFormWin',
					title : '入库单详细信息',
					iconCls:'menu-instock',
					width : 500,
					height : 260,
					items:this.formPanel,
					maximizable : true,
					modal : true,
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		//初始化form表单
		this.formPanel = new Ext.FormPanel({
		url : __ctxPath + '/admin/saveInStock.do',
		id : 'InStockForm',
		border : false,
		formId : 'InStockFormId',
		bodyStyle : 'padding : 5px;',
		items : [{
					name : 'inStock.buyId',
					id : 'buyId',
					xtype : 'hidden',
					value : this.buyId == null ? '' : this.buyId
				}, {
					name : 'inStock.goodsId',
					xtype : 'hidden',
					id : 'goodsId'
				}, {
					xtype : 'container',
					layout : 'column',
					border:false,
					style : 'padding-left:2px;margin-bottom:4px;',
					items : [{
								xtype : 'label',
								text : '商品名称:',
								style : 'margin-top:2px;',
								width : 106
							}, {
								xtype : 'textfield',
								name : 'inStock.officeGoods.goodsName',
								id : 'goodsName',
								allowBlank : false,
								readOnly : true,
								width:220
							}, {
								xtype : 'button',
								text : '选择商品',
								iconCls:'btn-select',
								handler : function() {
									GoodsSelector.getView(function(id, name) {
										var goodsIdField = Ext
												.getCmp('goodsId');
										goodsIdField.setValue(id);
										var goodsNameField = Ext
												.getCmp('goodsName');
										goodsNameField.setValue(name);
									}

									, true).show();
								}
							}, {
								xtype : 'button',
								text : ' 清除记录',
								iconCls:'reset',
								handler : function() {
									var goodsIdField = Ext.getCmp('goodsId');
									goodsIdField.setValue('');
									var goodsNameField = Ext
											.getCmp('goodsName');
									goodsNameField.setValue('');
								}
							}]
				}, {
					xtype : 'container',
					border:false,
					id : 'InStockFormContainer',
					defaultType : 'textfield',
					style : 'padding-left:3px;',
					layout : 'form',
					defaults : {
						widht : 300,
						anchor : '100%,100%'
					},
					items : [{
								fieldLabel : ' 供应商',
								name : 'inStock.providerName',
								id : 'providerName'
							}, {
								fieldLabel : ' 入库单号',
								name : 'inStock.stockNo',
								id : 'stockNo',
								allowBlank : false,
								xtype : 'textfield',
								readOnly : true
							}, {
								fieldLabel : '价格',
								name : 'inStock.price',
								allowBlank : false,
								id : 'price',
								xtype : 'numberfield'
							}, {
								fieldLabel : ' 总数',
								name : 'inStock.inCounts',
								allowBlank : false,
								id : 'inCounts',
								xtype : 'numberfield'
							}, {
								fieldLabel : ' 统计',
								name : 'inStock.amount',
								allowBlank : false,
								id : 'amount'
							}, {
								fieldLabel : ' 进货日期',
								name : 'inStock.inDate',
								allowBlank : false,
								editable : false,
								id : 'inDate',
								value: new Date(),
								xtype : 'datefield',
								format : 'Y-m-d',
								width : 126
							}]
				}, {
								xtype : 'container',
								layout : 'column',
								style : 'padding-left:2px;margin-bottom:4px;',
								border:false,
								// layout:'column',
								items : [{
											xtype : 'label',
											text : '购买人:',
											style : 'margin-top:2px;',
											width : 106
										}, {
											xtype : 'textfield',
											name : 'inStock.buyer',
											id : 'buyer',
											value:curUserInfo.fullname,
											allowBlank : false,
											readOnly : true,
											width:220
										}, {
											xtype : 'button',
											text : '选择人员',
											iconCls:'btn-users',
											handler : function() {
												UserSelector.getView(
														function(id, name) {
															var buyerField = Ext.getCmp('buyer');
															buyerField.setValue(name);
														}, false).show();
											}
										}, {
											xtype : 'button',
											text : ' 清除记录',
											iconCls:'reset',
											handler : function() {
												var buyerField = Ext
														.getCmp('buyer');
												buyerField.setValue('');
											}
										}]
							}]
	});

	if (this.buyId != null && this.buyId != 'undefined') {
		this.formPanel.getForm().load({
			deferredRender : false,
			url : __ctxPath + '/admin/getInStock.do?buyId=' + this.buyId,
			method : 'post',
			waitMsg : '正在载入数据...',
			success : function(form, action) {
				var inDate = action.result.data.inDate;
				var goodsId = action.result.data.officeGoods.goodsId;
				var goodsName = action.result.data.officeGoods.goodsName;
				var inDateField = Ext.getCmp('inDate');
				var goodsIdField = Ext.getCmp('goodsId');
				var goodsNameField = Ext.getCmp('goodsName');
				goodsIdField.setValue(goodsId);
				goodsNameField.setValue(goodsName);
				inDateField.setValue(new Date(getDateFromFormat(inDate, "yyyy-MM-dd HH:mm:ss")));
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
						var fp = Ext.getCmp('InStockForm');
						if (fp.getForm().isValid()) {
							fp.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									Ext.getCmp('InStockGrid').getStore()
											.reload();
									Ext.getCmp('InStockFormWin').close();
								},
								failure : function(fp, action) {
									Ext.MessageBox.show({
												title : '操作信息',
												msg : '信息保存出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
											});
									Ext.getCmp('InStockFormWin').close();
								}
							});
						}
					}
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : function() {
						Ext.getCmp('InStockFormWin').close();
					}
				}];//end of the buttons
	}//end of the initUIComponents
});

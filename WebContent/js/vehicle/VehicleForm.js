Ext.ns('VehicleForm');
/**
 * @author
 * @createtime
 * @class VehicleForm
 * @extends Ext.Window
 * @description VehicleForm表单
 * @company 宏天软件
 */
VehicleForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		VehicleForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'VehicleFormWin',
					title : '车辆档案',
					iconCls : 'menu-car',
					width : 500,
					height : 400,
					minWidth : 550,
					minHeight : 449,
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
		this.formPanel = new Ext.FormPanel({
			url : __ctxPath + '/admin/saveCar.do',
			layout : 'hbox',
			layoutConfig : {
				padding : '5',
				align : 'middle'
			},
			defaults : {
				margins : '0 5 0 0',
				width : 450
			},
			id : 'VehicleForm',
			frame : false,
			formId : 'VehicleFormId',
			items : [{
				xtype : 'panel',
				title : '基本信息',
				layout : 'form',
				frame : false,
				height : 400,
				// autoHeight:true,
				bodyStyle : 'padding:5px;',
				labelWidth : 100,
				defaults : {
					anchor : '95%,95%'
				},
				defaultType : 'textfield',
				items : [{
							name : 'departmentId',
							id : 'departmentId',
							xtype : 'hidden'
						}, {
							name : 'car.carid',
							id : 'carid',
							xtype : 'hidden',
							value : this.carid == null ? '' : this.carid
						}, {
							name : 'car.cartimage',
							id : 'cartimage',
							xtype : 'hidden'

						}, {
							fieldLabel : '车牌号码',
							name : 'car.carno',
							id : 'carno',
							allowBlank : false,
							xtype : 'textfield'
						}, {
							xtype : 'container',
							layout : 'column',
							id : 'checkCarType',
							style : 'padding-left:0px;margin-bottom:4px;',
							items : [{
								xtype : 'label',
								style : 'padding-left:0px;',
								text : '车辆类型:',
								width : 105
							}, {
								hiddenName : 'car.cartype',
								id : 'cartype',
								xtype : 'combo',
								width:235,
								mode : 'local',
								allowBlank : false,
								editable : false,
								triggerAction : 'all',
								value : '1',
								store : [['1', '轿车'], ['2', '货车'], ['3', '商务车'],
										['4', '客车'],['5', '大客车'], ['6', '面包车'],
											['7', '本田轿车'], ['8', '风度轿车']
											, ['9', '吉普车'], ['10', '陆地巡洋舰']
											, ['11', '福克斯']]
							},  {
										xtype : 'button',
										text : '清除记录',
										iconCls : 'reset',
										handler : function() {
											Ext.getCmp('cartype')
													.setValue('');

										}
									}]
						},{
							xtype : 'container',
							layout : 'column',
							id : 'checkfullname',
							style : 'padding-left:0px;margin-bottom:4px;',
							items : [{
								xtype : 'label',
								style : 'padding-left:0px;',
								text : '使用者:',
								width : 105
							}, {
								hiddenName : 'car.department.depId',
								id : 'car_depId',
								width : 235,
								xtype : 'combo',
								editable : false,
								triggerAction : 'all',
								displayField : 'depname',
								valueField : 'depid',	
								store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/system/select3ByComboDepartment.do',
									fields : ['depid', 'depname']
									})
							}, {
										xtype : 'button',
										text : '清除记录',
										iconCls : 'reset',
										handler : function() {
											Ext.getCmp('car_depId')
													.setValue('');

										}
									}]
						}, {
							fieldLabel : '车架号',
							name : 'car.engineno',
							id : 'engineno'
						}, {
							fieldLabel : '厂牌型号',
							name : 'car.factorymodel',
							id : 'factorymodel'
						},  /* {
								xtype : 'hidden',
								id : 'driverIds',
								name : 'carApply.driverIds'
							},*/ {
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
											name : 'car.driver',
											id : 'driver',
											editable : false,
											readOnly : true,
											width : 163
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
																},
																true,
															new Date(),new Date())
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
							},/*{
							fieldLabel : '驾驶员',
							name : 'car.driver',
							id : 'driver'
						},*/ {
							fieldLabel : '购置日期',
							name : 'car.buydate',
							id : 'buydate',
							editable : false,
							xtype : 'datefield',
							format : 'Y-m-d'
						}, {
							fieldLabel : '购买金额',
							name : 'car.purchase',
							xtype:'numberfield',
							id : 'purchase'
						},/* {
							fieldLabel : '发动机号',
							name : 'car.engineSpec',
							id : 'engineSpec'
						},*/ {
							fieldLabel : '总里程',
							name : 'car.distance',
							xtype:'numberfield',
							id : 'distance'
						}, {
							fieldLabel : '是否公用',
							hiddenName : 'car.isPublic',
							id : 'isPublic',
							xtype : 'combo',
							mode : 'local',
							allowBlank : false,
							editable : false,
							triggerAction : 'all',
							value : '1',
							store : [['1', '是'], ['2', '否']]
						},  {
							fieldLabel : '承载人数',
							name : 'car.passAmount',
							xtype : 'numberfield',
							id : 'passAmount',
							allowBlank : false
						} ,{
							fieldLabel : '车辆状态',// 1=可用2=维修中0=报废
							hiddenName : 'car.status',
							id : 'status',
							xtype : 'combo',
							mode : 'local',
							allowBlank : false,
							editable : false,
							triggerAction : 'all',
							value : '1',
							store : [[ '1', '可用' ],
							          ['2', '维修中'],
							          ['0', '已报废'],
							          ['5', '已停用']]
						}]
			}
			]
		});// end of the formPanel

		if (this.carid != null && this.carid != 'undefined') {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/admin/getCar.do?carid=' + this.carid,
				method : 'post',
				waitMsg : '正在载入数据...',
				success : function(form, action) {
				     var data = eval("(" + action.response.responseText
				       + ")").data;
				     if(data.department!=null){
				       Ext.getCmp('car_depId').setValue(
						data.department.depId);}
				     if(data.status==3)
				    	 Ext.getCmp('status').setValue(
								1);
					var buydate = action.result.data.buydate;
					Ext.getCmp('buydate').setValue(buydate);
					var carPanel = Ext.getCmp('vehicleImageDisplay');
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('编辑', '载入失败');
				}
			});
		};// load formPanel
		this.buttons = [{
			text : '保存',
			iconCls : 'btn-save',
			handler : function() {
				var fp = Ext.getCmp('VehicleForm');
				if (fp.getForm().isValid()) {
					fp.getForm().submit({
						method : 'post',
						waitMsg : '正在提交数据...',
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '成功保存信息！');

							Ext.getCmp('VehicleGrid').getStore().reload();
							Ext.getCmp('VehicleFormWin').close();

						},
						failure : function(fp, action) {
							var resultResp = Ext.util.JSON
									.decode(action.response.responseText);
							if (resultResp.result == 1) {
								Ext.MessageBox.show({
											title : '操作信息',
											msg : '车牌号码已存在!',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});
							} else {
								Ext.MessageBox.show({
											title : '操作信息',
											msg : '信息保存出错，请检查数据！',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});
							}
						}
					});
				}
			}
		}, {
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				Ext.getCmp('VehicleFormWin').close();
			}
		}];
	}
});

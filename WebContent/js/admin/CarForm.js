Ext.ns('CarForm');
/**
 * @author
 * @createtime
 * @class CarForm
 * @extends Ext.Window
 * @description CarForm表单
 * @company 宏天软件
 */
CarForm = Ext
		.extend(
				Ext.Window,
				{
					// 内嵌FormPanel
					formPanel : null,
					// 构造函数
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						// 必须先初始化组件
						this.initUIComponents();
						CarForm.superclass.constructor.call(this, {
							layout : 'fit',
							id : 'CarFormWin',
							title : '车辆详细信息',
							iconCls : 'menu-car',
							width : 900,
							height : 600,
							minWidth : 850,
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
						this.formPanel = new Ext.FormPanel(
								{
									url : __ctxPath + '/admin/saveCar.do',
									layout : 'hbox',
									layoutConfig : {
										padding : '5',
										align : 'middle'
									},
									defaults : {
										margins : '0 5 0 0',
										width : 500
									},
									id : 'CarForm',
									frame : false,
									formId : 'CarFormId',
									items : [
											{
												xtype : 'panel',
												title : '基本信息',
												layout : 'form',
												frame : false,
												height : 500,
//												autoHeight:true,
												bodyStyle : 'padding:5px;',
												labelWidth : 100,
												defaults : {
													anchor : '100%,100%'
												},
												defaultType : 'textfield',
												items : [
														{
															name : 'car.carid',
															id : 'carid',
															xtype : 'hidden',
															value : this.carid == null ? ''
																	: this.carid
														},
														{
															name : 'car.cartimage',
															id : 'cartimage',
															xtype : 'hidden'

														},
														{
															fieldLabel : '车牌号码',
															name : 'car.carno',
															id : 'carno',
															allowBlank : false,
															xtype : 'textfield'
														},
														{
															fieldLabel : '车辆类型',
															name : 'car.cartype',
															id : 'cartype',
															xtype : 'combo',
															mode : 'local',
															editable : false,
															allowBlank : false,
															triggerAction : 'all',
															value : '1',
															store : [
																	[ '1', '轿车' ],
																	[ '2', '货车' ],
																	[ '3',
																			'商务车' ] ]
														},
														{
															fieldLabel : '车架号',
															name : 'car.engineno',
															id : 'engineno'
														},
														{
															fieldLabel : '购买保险时间',
															name : 'car.buyinsuretime',
															id : 'buyinsuretime',
															editable : false,
															xtype : 'datefield',
															format : 'Y-m-d'
														},
														{
															fieldLabel : '年审时间',
															name : 'car.audittime',
															id : 'audittime',
															editable : false,
															xtype : 'datefield',
															format : 'Y-m-d'
														},
														{
															fieldLabel : '厂牌型号',
															name : 'car.factorymodel',
															id : 'factorymodel'
														},
														{
															xtype:'hidden',
															fieldLabel : '驾驶员',
															name : 'car.driver',
															id : 'driver'
														},
														{
															fieldLabel : '购置日期',
															name : 'car.buydate',
															id : 'buydate',
															editable : false,
															xtype : 'datefield',
															format : 'Y-m-d'
														},
														{
															fieldLabel : '当前状态',// 1=可用2=维修中0=报废
															hiddenName : 'car.status',
															id : 'status',
															xtype : 'combo',
															mode : 'local',
															allowBlank : false,
															editable : false,
															triggerAction : 'all',
															value : '1',
															store : [
																	[ '1', '可用' ],
																	[ '2',
																			'维修中'],
																	[ '3',
																			'已申请'],		
																	[ '0',
																			'已报废' ] ]
														},
														{
															fieldLabel : '承载人数',
															name : 'car.passAmount',
															id : 'passAmount',
															allowBlank : false
														},
														/*{
															xtype : 'hidden',
															name : 'car.oilCardId',
															id : 'oilCardId'
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
															items : [ {
																xtype : 'label',
																text : '油卡编号:',
																width : 103
															}, {
																id : 'OilCardCode',
																xtype : 'textfield',
																name : 'car.carOilCard.sn',
																editable : false,
																readOnly : true,
																allowBlank : false,
																width : 130
															}, {
																xtype : 'button',
																iconCls : 'btn-car',
																text : '选择油卡',
																handler : function() {
																	CarOilCardSelector.getView(function(id, name) {
																	   
																		Ext.getCmp('oilCardId').setValue(id);
																		Ext.getCmp('OilCardCode').setValue(name);
																	}, true,1

																	).show();
																}

															}, {
																xtype : 'button',
																text : '消除记录',
																iconCls : 'reset',
																handler : function() {
																	Ext.getCmp('oilCardId').setValue('');
																	Ext.getCmp('OilCardCode').setValue('');
																}
															} ]

														},*/
														/*{
															xtype : 'hidden',
															name : 'car.payCardId',
															id : 'payCardId'
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
															items : [ {
																xtype : 'label',
																text : '粤通卡编号:',
																width : 103
															}, {
																id : 'passCode',
																xtype : 'textfield',
																name : 'car.carPassFeeCard.sn',
																editable : false,
																readOnly : true,
																allowBlank : false,
																width : 130
															}, {
																xtype : 'button',
																iconCls : 'btn-car',
																text : '选择粤通卡',
																handler : function() {
																	CarPassFeeCardSelector.getView(function(id, name) {
																		Ext.getCmp('payCardId').setValue(id);
																		Ext.getCmp('passCode').setValue(name);
																	}, true,1

																	).show();
																}

															}, {
																xtype : 'button',
																text : '消除记录',
																iconCls : 'reset',
																handler : function() {
																	Ext.getCmp('payCardId').setValue('');
																	Ext.getCmp('passCode').setValue('');
																}
															} ]

														},*/
														{
															fieldLabel : '备注',
															name : 'car.notes',
															xtype : 'textarea',
															anchor : '100%,100%',
															id : 'notes'
														}
														
														]
											},
											{
												xtype : 'panel',
												id : 'carImageDisplay',
												frame : false,
												border : true,
												height : 500,
												html : '<img src="' + __ctxPath + '/images/default_image_car.jpg" width="400" height="350"/>',
												tbar : new Ext.Toolbar(
														{
															width : '100%',
															height : 30,
															items : [
																	{
																		text : '上传',
																		iconCls : 'btn-upload',
																		handler : function() {
																			var photo = Ext.getCmp('cartimage');
																			var dialog = App.createUploadDialog( {
																						file_cat : 'admin/car',
																						callback : CarForm.uploadCarPhoto,
																						permitted_extensions : [ 'jpg' ]
																					});
																			if (photo.getValue() != ''&& photo.getValue() != null&& photo.getValue() != 'undefined') {
																				var msg = '再次上传需要先删除原有图片,';
																				Ext.Msg.confirm(
																								'信息确认',
																								msg + '是否删除？',
																								function(
																										btn) {
																									if (btn == 'yes') {
																										// 删除图片
																										var carId = Ext
																												.getCmp(
																														'carid')
																												.getValue();
																										if (carId != null
																												&& carId != 'undefined') {
																											Ext.Ajax
																													.request( {
																														url : __ctxPath + '/admin/delphotoCar.do',
																														method : 'post',
																														params : {
																															carId : carId
																														},
																														success : function() {
																															var path = photo.value;
																															photo.setValue('');
																															var display = Ext
																																	.getCmp('carImageDisplay');
																															display.body
																																	.update('<img src="' + __ctxPath + '/images/default_image_car.jpg" width="100%" height="100%" />');
																															Ext.Ajax
																																	.request( {
																																		url : __ctxPath + '/system/deleteFileAttach.do',
																																		method : 'post',
																																		params : {
																																			filePath : path
																																		},
																																		success : function() {

																																			dialog.show('queryBtn');
																																			// }
																																		}
																																	});

																														}
																													});
																										}
																									}
																								})
																			} else {
																				dialog.show('queryBtn');
																			}
																		}
																	},
																	{
																		text : '删除',
																		iconCls : 'btn-delete',
																		handler : function() {
																			var photo = Ext
																					.getCmp('cartimage');
																			if (photo.value != null
																					&& photo.value != ''
																					&& photo.value != 'undefined') {
																				var msg = '照片一旦删除将不可恢复,';
																				Ext.Msg
																						.confirm(
																								'确认信息',
																								msg + '是否删除?',
																								function(
																										btn) {
																									if (btn == 'yes') {
																										// Ext.ux.Toast.msg('提示信息',
																										// '请上传规格为400
																										// X
																										// 350,或者此比例的照片.');
																										var carid = Ext
																												.getCmp(
																														'carid')
																												.getValue();
																										if (carid != null
																												&& carid != 'undefined') {
																											Ext.Ajax
																													.request( {
																														url : __ctxPath + '/admin/delphotoCar.do',
																														method : 'post',
																														params : {
																															carid : carid
																														},
																														success : function() {
																															var path = photo.value;
																															photo
																																	.setValue('');
																															var display = Ext
																																	.getCmp('carImageDisplay');
																															display.body
																																	.update('<img src="' + __ctxPath + '/images/default_image_car.jpg" width="400" height="350" />');
																															Ext.Ajax
																																	.request( {
																																		url : __ctxPath + '/system/deleteFileAttach.do',
																																		method : 'post',
																																		params : {
																																			filePath : path
																																		},
																																		success : function() {

																																		}
																																	});

																														}
																													});
																										}
																									}
																								});
																			}// end
																			// if
																			else {
																				Ext.ux.Toast
																						.msg(
																								'提示信息',
																								'您还未增加照片.');
																			}

																		}
																	} ]
														})

											}

									]
								});// end of the formPanel

						if (this.carid != null && this.carid != 'undefined') {
							this.formPanel
									.getForm()
									.load(
											{
												deferredRender : false,
												url : __ctxPath
														+ '/admin/getCar.do?carid='
														+ this.carid,
												method : 'post',
												waitMsg : '正在载入数据...',
												success : function(form, action) {
													var buyinsuretime = action.result.data.buyinsuretime;
													var audittime = action.result.data.audittime;
													var buydate = action.result.data.buydate;
													var carOilCard=action.result.data.carOilCard;
													if(carOilCard!=null){
													var sn=carOilCard.sn;
													Ext.getCmp('OilCardCode').setValue(sn);
													}
													var carPassFeeCard=action.result.data.carPassFeeCard;
													if(carPassFeeCard!=null){
														var passCode=carPassFeeCard.sn; 
												
														Ext.getCmp('passCode').setValue(passCode);
													}
												
													

													Ext
															.getCmp(
																	'buyinsuretime')
															.setValue(
																	buyinsuretime);
													Ext
															.getCmp('audittime')
															.setValue(audittime);
													Ext.getCmp('buydate')
															.setValue(buydate);
													var carimage = action.result.data.cartimage;
													var carPanel = Ext
															.getCmp('carImageDisplay');
													if (carimage != null
															&& carimage != ''
															&& carimage != 'undefind'
															&& carPanel.body != null) {
														carPanel.body
																.update('<img src="'
																		+ __ctxPath
																		+ '/attachFiles/'
																		+ carimage
																		+ '"  width="400" height="350"/>');
													}
												},
												failure : function(form, action) {
													Ext.ux.Toast.msg('编辑',
															'载入失败');
												}
											});
						}
						;// load formPanel

						this.buttons = [
								{
									text : '保存',
									iconCls : 'btn-save',
									handler : function() {
										var fp = Ext.getCmp('CarForm');
										if (fp.getForm().isValid()) {
											fp
													.getForm()
													.submit(
															{
																method : 'post',
																waitMsg : '正在提交数据...',
																success : function(
																		fp,
																		action) {
																	Ext.ux.Toast.msg('操作信息','成功保存信息！');

																	Ext.getCmp('CarGrid').getStore().reload();
																	Ext.getCmp('CarFormWin').close();
																
																},
																failure : function(fp,action) {
																	var resultResp = Ext.util.JSON
																			.decode(action.response.responseText);
																	if (resultResp.result == 1) {
																		Ext.MessageBox
																				.show( {
																					title : '操作信息',
																					msg : '车牌号码已存在!',
																					buttons : Ext.MessageBox.OK,
																					icon : 'ext-mb-error'
																				});
																	} else {
																		Ext.MessageBox
																				.show( {
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
										Ext.getCmp('CarFormWin').close();
									}
								} ];// end of the buttons
					}// end of the initUICpomponents
				});
CarForm.uploadCarPhoto = function(data) {
	if(data.length>1){
		Ext.MessageBox
		.show( {
			title : '操作信息',
			msg : '只能上传一张图片！',
			buttons : Ext.MessageBox.OK,
			icon : 'ext-mb-error'
		});
	}else {
		var photo = Ext.getCmp('cartimage');
		var display = Ext.getCmp('carImageDisplay');
		photo.setValue(data[0].filepath);
		display.body.update('<img src="' + __ctxPath + '/attachFiles/'
				+ data[0].filepath + '"  width="100%" height="100%"/>');	
	}
	
};

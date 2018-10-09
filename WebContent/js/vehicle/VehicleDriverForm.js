/**
 * @author
 * @createtime
 * @class VehicleDriverForm
 * @extends Ext.Window
 * @description CarDriver表单
 * @company 捷达世软件
 */
VehicleDriverForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		VehicleDriverForm.superclass.constructor.call(this, {
					id : 'VehicleDriverFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					width : 650,
					height : 450,
					maximizable : true,
					title : '司机详细信息',
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
								handler : this.cancel
							}]
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel({
			layout : 'hbox',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [{
				xtype : 'panel',
				title : '基本信息',
				layout : 'form',
				frame : false,
				height : 350,
				width : 300,
				bodyStyle : 'padding:5px;',
				labelWidth : 100,
				defaults : {
					anchor : '96%,96%'
				},
				defaultType : 'textfield',
				items : [{
							name : 'carDriver.id',
							id : 'txtCarDriverId',
							xtype : 'hidden',
							value : this.id == null ? '' : this.id
						}, {
							fieldLabel : '驾驶证编号',
							name : 'carDriver.code',
							maxLength : 30
						}, {
							fieldLabel : '姓名',
							name : 'carDriver.name',
							allowBlank : false,
							maxLength : 50
						}, {
							fieldLabel : '手机',
							name : 'carDriver.cellPhone',
							maxLength : 11,
							xtype : 'numberfield'

						}, {
							fieldLabel : '短号',
							name : 'carDriver.shortPhone',
							maxLength : 8,
							xtype : 'numberfield'
						}, {
							fieldLabel : '家庭电话',
							name : 'carDriver.homePhone',
							maxLength : 30,
							xtype : 'numberfield'
						}, {
							fieldLabel : 'EMAIL',
							name : 'carDriver.email',
							maxLength : 150,
							vtype : 'myemail'
						}, {
							fieldLabel : '状态',
							hiddenName : 'carDriver.isLeaving',
							allowBlank : false,
							editable : false,
							xtype : 'combo',
							mode : 'local',
							triggerAction : 'all',
							value : '1',
							store : [['1', '在职'], ['0', '离职']]
						}, {
							xtype : 'hidden',
							name : 'carDriver.imageSource',
							id : 'VehicleDriverImageSource'
						}, {
							fieldLabel : '准驾车型',
							hiddenName : 'carDriver.licenseClass',
							allowBlank : false,
							editable : false,
							xtype : 'combo',
							mode : 'local',
							triggerAction : 'all',
							value : '6',
							store : [['1', 'A1'], ['2', 'A2'], ['3', 'A3'],
									['4', 'B1'], ['5', 'B2'], ['6', 'C1'],
									['7', 'C2'], ['8', 'C3'], ['9', 'C4'],
									['10', 'D'], ['11', 'E'], ['12', 'F'],
									['13', 'M'], ['14', 'N'], ['15', 'P']]
						}/*, {
							fieldLabel : '驾照有效开始日期',
							name : 'carDriver.licenseSDt',
							id:'licenseSDt',
							xtype : 'datefield',
							format : 'Y-m-d',
							value : new Date()
						}, {
							fieldLabel : '驾照有效结束日期',
							name : 'carDriver.licenseEDt',
							id:'licenseEDt',
							xtype : 'datefield',
							format : 'Y-m-d',
							value : new Date()
						}*/]
					// end of basic panel items
			}		// end of basic panel
			,{
				xtype : 'panel',
				id : 'VehicleImageDisplay',
				frame : false,
				border : true,
				height : 350,
				html : '<img src="'
						+ __ctxPath
						+ '/images/default_image_car.jpg" width="300" height="250"/>',
				tbar : new Ext.Toolbar({
					width : '100%',
					height : 30,
					items : [{
						text : '上传',
						iconCls : 'btn-upload',
						permitted_extensions : ['jpg'],
						handler : function() {
							var photo = Ext.getCmp('VehicleDriverImageSource');
							var dialog = App.createUploadDialog({
								file_cat : 'cardriver',
								callback : function(data) {
									if (data.length > 1) {
										Ext.MessageBox.show({
													title : '操作信息',
													msg : '只能上传一张图片！',
													buttons : Ext.MessageBox.OK,
													icon : 'ext-mb-error'
												});
									} else {
										var photo = Ext
												.getCmp('VehicleDriverImageSource');
										var display = Ext
												.getCmp('VehicleImageDisplay');
										photo.setValue(data[0].filepath);
										display.body
												.update('<img src="'
														+ __ctxPath
														+ '/attachFiles/'
														+ data[0].filepath
														+ '"  width="100%" height="100%"/>');
									}
								}// end
									// of
									// callback
							}); // end
							// of
							// dialog

							if (photo.getValue() != ''
									&& photo.getValue() != null
									&& photo.getValue() != 'undefined') {
								var msg = '再次上传需要先删除原有图片,';
								Ext.Msg.confirm('信息确认', msg + '是否删除？',
										function(btn) {
											if (btn == 'yes') {
												// 删除图片
												var carDriverId = Ext
														.getCmp('txtCarDriverId')
														.getValue();
												if (carDriverId != null
														&& carDriverId != 'undefined') {
													Ext.Ajax.request({
														url : __ctxPath
																+ '/admin/delPhotoCarDriver.do',
														method : 'post',
														params : {
															id : carDriverId
														},
														success : function() {
															var path = photo.value;
															photo.setValue('');
															var display = Ext
																	.getCmp('VehicleImageDisplay');
															display.body
																	.update('<img src="'
																			+ __ctxPath
																			+ '/images/default_image_car.jpg" width="100%" height="100%" />');
															Ext.Ajax.request({
																url : __ctxPath
																		+ '/system/deleteFileAttach.do',
																method : 'post',
																params : {
																	filePath : path
																},
																success : function() {
																	dialog
																			.show('queryBtn');
																}
															});

														}
													});
												}// end
												// of
												// if
											}// end
											// of
											// if
											// btn
											// ==
											// 'yes'
										}) // end
								// of
								// Ext.Msg.confirm
							} else {
								dialog.show('queryBtn');
							}
						}// end
							// of
							// handler
					}, {
						text : '删除',
						iconCls : 'btn-delete',
						handler : function() {
							var photo = Ext.getCmp('VehicleDriverImageSource');
							if (photo.value != null && photo.value != ''
									&& photo.value != 'undefined') {
								var msg = '照片一旦删除将不可恢复,';
								Ext.Msg.confirm('确认信息', msg + '是否删除?',
										function(btn) {
											if (btn == 'yes') {
												var carDriverId = Ext
														.getCmp('txtCarDriverId')
														.getValue();
												if (carDriverId != null
														&& carDriverId != 'undefined') {
													Ext.Ajax.request({
														url : __ctxPath
																+ '/admin/delPhotoCarDriver.do',
														method : 'post',
														params : {
															id : carDriverId
														},
														success : function() {
															var path = photo.value;
															photo.setValue('');
															var display = Ext
																	.getCmp('VehicleImageDisplay');
															display.body
																	.update('<img src="'
																			+ __ctxPath
																			+ '/images/default_image_car.jpg" width="400" height="350" />');
															Ext.Ajax.request({
																url : __ctxPath
																		+ '/system/deleteFileAttach.do',
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
											}// end
											// of
											// btn
											// ==
											// 'yes'
										}); // end
								// of
								// Ext.Msg.confirm
							}// end
							else {
								Ext.ux.Toast.msg('提示信息', '您还未增加照片.');
							}
						} // end
							// of
							// handler
					}]
				})
			}]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
				url : __ctxPath + '/admin/getCarDriver.do?id=' + this.id,
				root : 'data',
				preName : 'carDriver',
				success : function(response, options) {
					var carimage = Ext.getCmp('VehicleDriverImageSource').value;
					var carPanel = Ext.getCmp('VehicleImageDisplay');
					if (carimage != null && carimage != ''
							&& carimage != 'undefind' && carPanel.body != null) {
						carPanel.body.update('<img src="' + __ctxPath
								+ '/attachFiles/' + carimage
								+ '"  width="400" height="350"/>');
					}
				}
			});
		}
		Ext.apply(Ext.form.VTypes, {
			myemailText : '请输入正确的邮箱地址',
			myemail : function(v) {
				if (String(v) == '') {
					return true;
				}
				var email = /^(\w+)([-+.][\w]+)*@(\w[-\w]*\.){1,5}([A-Za-z]){2,4}$/;
				return email.test(v);
			}
		});

	},// end of the initcomponents

	/**
	 * 重置
	 * 
	 * @param {}
	 *            formPanel
	 */
	reset : function() {
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function() {
		this.close();
	},
	/**
	 * 保存记录
	 */
	save : function() {
		$postForm({
					formPanel : this.formPanel,
					scope : this,
					url : __ctxPath + '/admin/saveCarDriver.do',
					callback : function(fp, action) {
						var gridPanel = Ext.getCmp('VehicleDriverGrid');
						if (gridPanel != null) {
							gridPanel.getStore().reload();
						}
						this.close();
					}
				});
	}// end of save
});

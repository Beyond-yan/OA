var ProfileForm = function(_userId) {
	return this.setup(_userId);
};

ProfileForm.prototype.setup = function(userId) {
	var footToolbar = this.initFooterToolbar(userId);
	var profileform = new Ext.form.FormPanel({
		id : 'ProfileForm',
		title : '我的信息',
		closable : true,
		iconCls : 'menu-customer',
		border : false, // 不要边框
		autoScroll : true,
		labelAlign : "right",
		layout : 'fit',
		tbar : footToolbar,
		defaultType : "textfield",
		url : __ctxPath + '/system/profileAppUser.do',
		reader : new Ext.data.JsonReader({
					root : 'data'
				}, [{
							name : 'appUser.userId',
							mapping : 'userId'
						}, {
							name : 'appUser.username',
							mapping : 'username'
						}, {
							name : 'appUser.fullname',
							mapping : 'fullname'
						}, {
							name : 'appUser.email',
							mapping : 'email'
						}, {
							name : 'appUser.ext',
							mapping : 'ext'
						}, {
							name : 'appUser.shortPhone',
							mapping : 'shortPhone'
						}, {
							name : 'appUser.officePhone',
							mapping : 'officePhone'
						}, {
							name : 'appUser.room',
							mapping : 'room'
						}, {
							name : 'profileTitle',
							mapping : 'title'
						}, {
							name : 'appUser.position',
							mapping : 'position'
						}, {
							name : 'appUser.phone',
							mapping : 'phone'
						}, {
							name : 'appUser.mobile',
							mapping : 'mobile'
						}, {
							name : 'appUser.fax',
							mapping : 'fax'
						}, {
							name : 'appUser.birthday',
							mapping : 'birthday',
							convert:function(v){alert(v);return new Date(v);}
						}, {
							name : 'appUser.zip',
							mapping : 'zip'
						}, {
							name : 'appUser.photo',
							mapping : 'photo'
						}, {
							name : 'appUser.tmpPersonnelEmployee',
							mapping : 'tmpPersonnelEmployee'
						}]),
		items : [{
			xtype : 'panel',
			frame : false,
			autoWidth : true,
			autoHeight : true,
			border : false,
			layout : 'table',
			bodyStyle : "margin-top:5px;margin-left: 17%; background-color: transparent;",
			layoutConfig : {
				columns : 2
			},
		items :[{
			id : 'displayProfilePhoto',
			xtype : "panel",
			width : 230,
			rowspan : 2,
			style:'padding:3px 4px 25px 0px;',
			height : 435,
			title : "个人照片",
			html : '<img src="' + __ctxPath
					+ '/images/default_image_male.jpg"/>',
			tbar : new Ext.Toolbar({
						height : 30,
						items : [{
									text : '上传',
									iconCls : 'btn-upload',
									handler : function() {
										ProfileForm.uploadPhotoBtn(userId);
									}
								}, {
									text : '删除',
									iconCls : 'btn-delete',
									handler : function() {
										ProfileForm.deleteUserPhoto(userId);
									}
								}]
					})
		}, {
			xtype : "panel",
			id : 'ProfileMustInfo',
			width : 305,
			height : 435,
			title : "我的资料",
			layout : 'form',
			style:'padding:3px 4px 25px 0px;',
			defaultType : "textfield",
			defaults : {
				width : 203
			},
			labelWidth : 55,
			labelAlign : "right",
			hideLabels : false,
			items : [{
						xtype : 'hidden',
						fieldLabel : '员工ID',
						name : 'appUser.userId',
						id : 'profile.userId'
					}, {
						fieldLabel : '登录账号',
						name : 'appUser.username',
						id : 'profile.username',
						disabled:true
					}, {
						fieldLabel : '员工姓名',
						name : 'appUser.fullname',
						id : 'profile.fullname',
						allowBlank : false,
						blankText : '员工姓名不能为空!'
					}, {
						fieldLabel : 'E-mail',
						name : 'appUser.email',
						id : 'profile.email',
						vtype : 'email',
						readOnly : true,
						allowBlank : false,
						blankText : '邮箱不能为空!',
						vtypeText : '邮箱格式不正确!'
					}, {
						fieldLabel : '性别',
						xtype : 'combo',
						hiddenName : 'appUser.title',
						id : 'profileTitle',
						mode : 'local',
						editable : false,
						triggerAction : 'all',
						store : [['1', '先生'], ['0', '女士']],
						value : '1',
						listeners : {
							select : function(combo, record, index) {
								var photo = Ext.getCmp('profile.photo');
								if (photo.value == ''
										|| photo.value == 'undefined'
										|| photo.value == null) {
									var display = Ext
											.getCmp('displayProfilePhoto');
									if (combo.value == '0') {
										display.body
												.update('<img src="'
														+ __ctxPath
														+ '/images/default_image_female.jpg" />');
									} else {
										display.body
												.update('<img src="'
														+ __ctxPath
														+ '/images/default_image_male.jpg" />');
									}
								}
							}
						}
					}, {
						fieldLabel : '电话',
					    xtype : 'numberfield',
						name : 'appUser.phone'
					} , {
						fieldLabel : '移动电话',
						xtype : 'numberfield',
						name : 'appUser.mobile',
						id : 'appUser.mobile',
						regex :/^\d{11}$/,
						regexText:'请输入11位手机号码' 
					},  {
						fieldLabel : '短号',
						xtype : 'numberfield',
						name : 'appUser.tmpPersonnelEmployee.shortPhone'
					},  {
						fieldLabel : '办公电话',
						xtype : 'numberfield',
						name : 'appUser.tmpPersonnelEmployee.officePhone'
					}, {
						fieldLabel : '分机',
						xtype : 'numberfield',
						name : 'appUser.tmpPersonnelEmployee.ext'
					}, {
						fieldLabel : '科室',
						name : 'appUser.tmpPersonnelEmployee.room'
					}, {
						fieldLabel : '传真',
						name : 'appUser.fax'
					}, {
						fieldLabel : '邮编',
						xtype : 'numberfield',
						name : 'appUser.zip'
					},{
						fieldLabel : '出生日期',
						xtype : 'datefield',
						format : 'm月d日',
						allowBlank:true,
						editable : false,
						name : 'appUser.birthday',
						id:'appUser.birthday'
					},{
						fieldLabel : '身份证号',
						xtype : 'textfield',
						allowBlank:true,
						editable : false,
						name : 'appUser.idNumber',
						id:'appUser.idNumber'
					},{
						filedLabel : '照片',
						xtype : 'hidden',
						id : 'profile.photo',
						name : 'appUser.photo'
					}]
		}]}]
	});
			profileform.loadData({
				url : __ctxPath + '/system/ggetAppUser.do',
				root : 'data',
				preName : 'appUser'
			});
			
			// init the photo 
			var photo = Ext.getCmp('profile.photo');
			var display = Ext.getCmp('displayProfilePhoto');
			var appUserTitle = Ext.getCmp('profileTitle');
			if (photo.value != '' && photo.value != null
					&& photo.value != 'undefined') {
				display.body.update('<img src="' + __ctxPath + '/attachFiles/'
						+ photo.value + '" width="100%" height="100%"/>');
			} else if (appUserTitle.value == '0') {
				display.body.update('<img src="' + __ctxPath
						+ '/images/default_image_female.jpg" />');
			}
			
	

	return profileform;
};
// 初始化操作菜单
ProfileForm.prototype.initFooterToolbar = function(userId) {

	var toolbar = new Ext.Toolbar({
				id : 'ProfileFormToolbar',
				height : 30,
				items : [{
					text : '保存',
					iconCls : 'btn-save',
					handler : function() {
						var userform = Ext.getCmp('ProfileForm');
						userform.getForm().submit({
									waitMsg : '正在提交用户信息',
									params:{
										'appUser.birthday':Ext.getCmp('appUser.birthday').getValue().format('Y-m-d')
									},
									success : function(userform, o) {
										Ext.ux.Toast.msg('操作信息', '保存成功！')
										var userview = Ext
												.getCmp('AppUserGrid');
										if (userview != null) {// 假如员工列表不为空,则重载数据
											userview.getStore().reload({
														start : 0,
														limit : 25
													});
										}
									}
								});
					}

				}, {
					text : '取消',
					iconCls : 'reset',
					handler : function() {
						var tabs = Ext.getCmp('centerTabPanel');
						tabs.remove('ProfileForm');
					}
				} , {
					text : '修改密码',
					iconCls : 'btn-password',
					handler : function() 
					{
						new ResetPasswordForm(userId);
					}
				}
				]
			});
	return toolbar;
};

ProfileForm.uploadPhotoBtn = function(userId) {
	var photo = Ext.getCmp('profile.photo');
	var dialog = App.createUploadDialog({
				file_cat : 'system/appUser',
				callback : uploadUserPhoto,
				permitted_extensions : ['jpg']
			});
	if (photo.value != '' && photo.value != null && photo.value != 'undefined') {
		var msg = '再次上传需要先删除原有图片,';
		Ext.Msg.confirm('信息确认', msg + '是否删除？', function(btn) {
			if (btn == 'yes') {
				// 删除图片
				Ext.Ajax.request({
					url : __ctxPath + '/system/deleteFileAttach.do',
					method : 'post',
					params : {
						filePath : photo.value
					},
					success : function() {
						if (userId != '' && userId != null
								&& userId != 'undefined') {
							Ext.Ajax.request({
								url : __ctxPath + '/system/photoAppUser.do',
								method : 'post',
								params : {
									userId : userId
								},
								success : function() {
									photo.setValue('');
									var appUserTitle = Ext
											.getCmp('profileTitle');
									var display = Ext
											.getCmp('displayProfilePhoto');
									if (appUserTitle.value == 1) {
										display.body
												.update('<img src="'
														+ __ctxPath
														+ '/images/default_image_male.jpg" />');
									} else {
										display.body
												.update('<img src="'
														+ __ctxPath
														+ '/images/default_image_female.jpg" />');
									}
									dialog.show('queryBtn');
								}
							});
						} else {
							photo.setValue('');
							var profileTitle = Ext.getCmp('profileTitle');
							var display = Ext.getCmp('displayProfilePhoto');
							if (profileTitle.value == 1) {
								display.body.update('<img src="' + __ctxPath
										+ '/images/default_image_male.jpg" />');
							} else {
								display.body
										.update('<img src="'
												+ __ctxPath
												+ '/images/default_image_female.jpg" />');
							}
							dialog.show('queryBtn');
						}
					}
				});
			}
		})
	} else {
		dialog.show('queryBtn');
	}
}

ProfileForm.deleteUserPhoto = function(userId) {
	var photo = Ext.getCmp('profile.photo');
	if (photo.value != null && photo.value != '' && photo.value != 'undefined') {
		var msg = '照片一旦删除将不可恢复,';
		Ext.Msg.confirm('确认信息', msg + '是否删除?', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url : __ctxPath + '/system/deleteFileAttach.do',
					method : 'post',
					params : {
						filePath : photo.value
					},
					success : function() {
						if (userId != '' && userId != null
								&& userId != 'undefined') {
							Ext.Ajax.request({
								url : __ctxPath + '/system/photoAppUser.do',
								method : 'post',
								params : {
									userId : userId
								},
								success : function() {
									photo.setValue('');
									var profileTitle = Ext
											.getCmp('profileTitle');
									var display = Ext
											.getCmp('displayProfilePhoto');
									if (profileTitle.value == 1) {
										display.body
												.update('<img src="'
														+ __ctxPath
														+ '/images/default_image_male.jpg" />');
									} else {
										display.body
												.update('<img src="'
														+ __ctxPath
														+ '/images/default_image_female.jpg" />');
									}
								}
							});
						} else {
							photo.setValue('');
							var profileTitle = Ext.getCmp('profileTitle');
							var display = Ext.getCmp('displayProfilePhoto');
							if (profileTitle.value == 1) {
								display.body.update('<img src="' + __ctxPath
										+ '/images/default_image_male.jpg" />');
							} else {
								display.body
										.update('<img src="'
												+ __ctxPath
												+ '/images/default_image_female.jpg" />');
							}
						}
					}
				});
			}
		});
	}// end if
	else {
		Ext.ux.Toast.msg('提示信息', '您还未增加照片.');
	}

}
/**
 * 上传照片
 * 
 * @param {}
 *            data
 */
function uploadUserPhoto(data) {
	var photo = Ext.getCmp('profile.photo');
	var display = Ext.getCmp('displayProfilePhoto');
	photo.setValue(data[0].filepath);
	display.body.update('<img src="' + __ctxPath + '/attachFiles/'
			+ data[0].filepath + '"  width="100%" height="100%"/>');
};

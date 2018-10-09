/**
 * @author:Ropen
 * @createtime
 * @class OdCommoncommentsForm
 * @extends Ext.Window
 * @description OdCommoncomments表单（添加批示语类别）
 * @company 捷达世软件
 */
OdCommonCommentsForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		OdCommonCommentsForm.superclass.constructor.call(this, {
					id : 'OdCommonCommentsFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					height : 300,
					width : 500,
					maximizable : true,
					title : '常用批示语详细信息',
					buttonAlign : 'center',
					buttons : [{
								text : '保存',
								iconCls : 'btn-save',
								scope : this,
								handler : this.save
							}, /*{
								text : '重置',
								iconCls : 'btn-reset',
								scope : this,
								handler : this.reset
							},*/ {
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
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			id : 'OdCommonComments.formPanel',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [{
						name : 'odCommonComments.id',
						xtype : 'hidden',
						value : this.id == null ? '' : this.id
					}, {
						fieldLabel : '批示内容',
						name : 'odCommonComments.commentTitle',
						allowBlank : false,
						maxLength : 50
					}, {
						fieldLabel : '批示描述',
						name : 'odCommonComments.commentDesc',
						xtype : 'textarea',
						maxLength : 400
					}, /*
						 * { fieldLabel : '批示语类型', name :
						 * 'odCommoncomments.commentType', allowBlank : false,
						 * xtype : 'numberfield' }
						 */{
						xtype : 'radiogroup',
						fieldLabel : '批示语类型',
						items : [{
									boxLabel : '通用',
									name : 'odCommonComments.commentType',
									inputValue : 1,
									checked : true,
									listeners : {
										scope : this,
										'check' : function(checkbox, checked) {
											if (checked) {// 只有在点击时触发
												Ext.getCmp('commentUser')
														.hide();
											}
										}
									}
								}, {
									boxLabel : '个人',
									name : 'odCommonComments.commentType',
									inputValue : 0,
									listeners : {
										scope : this,
										'check' : function(checkbox, checked) {
											if (checked) {// 只有在点击时触发
												Ext.getCmp('commentUser')
														.show();
											}
										}
									}

								}]

					},{
						xtype : 'radiogroup',
						fieldLabel : '批示语类别',
						items : [{
							boxLabel : '发文',
							name : 'odCommonComments.ref1',
							inputValue : 0,
							checked : true
						}, {
							boxLabel : '收文',
							name : 'odCommonComments.ref1',
							inputValue : 1
						}, {
							boxLabel : '会议',
							name : 'odCommonComments.ref1',
							inputValue : 2
						}, {
							boxLabel : '退文',
							name : 'odCommonComments.ref1',
							inputValue : 3
						}]
					},{
						xtype : 'container',
						id : 'commentUser',
						hidden : true,
						style : 'padding-top:3px;',
						layout : 'column',
						items : [{
									xtype : 'label',
									text : '批示人:',
									width : 105
								}, {
									xtype : 'textfield',
									name : 'odCommonComments.appUser.fullname',
									id : 'odCommonComments.appUser.fullname',
									width : 284,
									readOnly : true
								}, {
									xtype : 'hidden',
									name : 'odCommonComments.appUser.userId',
									id : 'odCommonComments.appUser.userId'
								}, {
									xtype : 'button',
									text : '请选择',
									iconCls : 'btn-user-sel',
									handler : function() {
										UserSelector.getView(
												function(userId, fullName) {
													var fm = Ext
															.getCmp("OdCommonComments.formPanel");
													fm
															.getCmpByName('odCommonComments.appUser.userId')
															.setValue(userId);
													fm
															.getCmpByName('odCommonComments.appUser.fullname')
															.setValue(fullName);
												}, true).show();
									}
								}]
					}]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
						url : __ctxPath + '/archive/getOdCommonComments.do?id='
								+ this.id,
						root : 'data',
						preName : 'odCommonComments'
					});
		}

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
		var fm = Ext.getCmp("OdCommonComments.formPanel");
		var commentType = fm.getCmpByName('odCommonComments.commentType')
				.getValue();
		if (commentType == "0") {
			var commentName = fm
					.getCmpByName('odCommonComments.appUser.fullname')
					.getValue();
			if (commentName == '' || commentName == null) {
				Ext.ux.Toast.msg('操作提示', '当批示语类型为个人时，必须选择批示人！');
				return;
			}
		}
		$postForm({
					formPanel : this.formPanel,
					scope : this,
					url : __ctxPath + '/archive/saveOdCommonComments.do',
					callback : function(fp, action) {
						var gridPanel = Ext.getCmp('OdCommonCommentsGrid');
						if (gridPanel != null) {
							gridPanel.getStore().reload();
						}
						this.close();
					}
				});
	}// end of save

});
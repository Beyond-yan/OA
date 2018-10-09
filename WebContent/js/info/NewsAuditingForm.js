/**
 * @author
 * @createtime
 * @class NewsAuditingForm
 * @extends Ext.Window
 * @description NewsAuditingForm表单
 * @company
 */

NewsAuditingForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
  		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		NewsAuditingForm.superclass.constructor.call(this, {
			layout : 'fit',
			items : this.formPanel,
			border : false,
			plain : true,
			id : 'NewsAuditingForm'+this.suffix,
			title : '审核详细信息',
			iconCls : 'menu-news',
			width : 800,
			minWidth : 799,
			height : 550,
			minHeight : 524,
			maximizable : true,
			modal : true,
			buttonAlign : 'center'/*,
			buttons : this.buttons*/
				// [this.btnAgree,this.btnDisagree,this.btnClose]
			});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {


		var actionFlag = this.actionFlag;
	 	var suffix=this.suffix;

		this.formPanel = this.setup();

		if (this.newsId != null && this.newsId != 'undefined') { 
			//this.formPanel.getForm().load({
		this.formPanel.loadData({
						deferredRender : false,
						url : __ctxPath + '/info/getNews.do?newsId='
								+ this.newsId,
						root:'data',
						preName:'news',
						waitMsg : '正在载入数据...',
						success : function(form, action) {
							// 载入成功后载入图片
						},
						failure : function(form, action) {
							Ext.ux.Toast.msg('编辑', '载入失败');
						}
					});
		}

  		// 声明一个数组,用于容纳 按钮
		this.buttons = [];
		if (this.auditingStatus == 0) {
			this.btnAgree = {
				text : '同意',
				id : 'btnAgree',
				iconCls : 'btn-save',
				handler : function() {
 					var fp = Ext.getCmp('NewsAuditingForm.NewsAuditingForm'+suffix);
					var NewsGrid = Ext.getCmp('NewsGrid'+suffix);
					
					if (fp.getForm().isValid()) {
						Ext.getCmp('NewsAuditingForm.issuer'+suffix).setValue(curUserInfo.fullname);
						fp.getForm().submit({
									method : 'post',
									waitMsg : '正在提交数据...',
									success : function(fp, action) {
										Ext.ux.Toast.msg('操作信息', '审核成功！'); 
 										NewsGrid.getStore().reload(); 
										Ext.getCmp('NewsAuditingForm'+suffix).close();
									},
									failure : function(fp, action) {
										Ext.MessageBox.show({
													title : '操作信息',
													msg : '操作出错，请联系管理员！',
													buttons : Ext.MessageBox.OK,
													icon : 'ext-mb-error'
												});
 										NewsGrid.getStore().reload(); 
										Ext.getCmp('NewsAuditingForm'+suffix).close();
									}
								}); 
					}
				}
			}

			this.btnDisagree = {
				text : '拒绝',
				id : 'btnDisagree',
				iconCls : 'btn-delete',
				handler : function() {
					var fp = Ext.getCmp('NewsAuditingForm.NewsAuditingForm'+suffix);
					var NewsGrid = Ext.getCmp('NewsGrid'+suffix);
					if (fp.getForm().isValid()) {
						fp.getForm().submit({
							waitMsg : '正在提交操作...',
							url : __ctxPath
									+ '/info/updateNews.do?auditingAction=disagree',
							success : function(formPanel, action) {
								Ext.ux.Toast.msg('操作信息', '操作成功！'); 
								//if (actionFlag == 1) {
									NewsGrid.getStore().reload();
								//}
/*								if (actionFlag == 3) {
									PA_NewsGrid.getStore().reload();
								}
								if (actionFlag == 22) {
									PAA_NewsGrid.getStore().reload();
								}
								if (actionFlag == 6) {
									SA_NewsGrid.getStore().reload();
								}
								if (actionFlag == 4) {
									CCA_NewsGrid.getStore().reload();
								}*/
								Ext.getCmp('NewsAuditingForm'+suffix).close();
							},
							failure : function(formPanel, action) {
								Ext.MessageBox.show({
											title : '操作信息',
											msg : '操作出错，请联系管理员！',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});

/*								if (actionFlag == 1) {
									CA_NewsGrid.getStore().reload();
								}
								if (actionFlag == 3) {
									PA_NewsGrid.getStore().reload();
								}
								if (actionFlag == 22) {
									PAA_NewsGrid.getStore().reload();
								}
								if (actionFlag == 6) {
									SA_NewsGrid.getStore().reload();
								}
								if (actionFlag == 4) {
									CCA_NewsGrid.getStore().reload();
								}*/
							 	NewsGrid.getStore().reload();
								Ext.getCmp('NewsAuditingForm'+suffix).close();
							}
						});// success结束
					}// if结束

				}
			}
			this.buttons = [this.btnAgree, this.btnDisagree];
		}

		this.btnClose = {
			text : '关闭',
			handler : function() {
				Ext.getCmp('NewsAuditingForm'+suffix).close();
			}
		}

			this.btnInvalidation = {
				text : '失效',
				id : 'btnInvalidation',
				iconCls : 'btn-delete',
				handler : function() {
					var fp = Ext.getCmp('NewsAuditingForm.NewsAuditingForm'+suffix);
					var NewsGrid = Ext.getCmp('NewsGrid'+suffix);
					if (fp.getForm().isValid()) {
						fp.getForm().submit({
							waitMsg : '正在提交操作...',
							url : __ctxPath
									+ '/info/updateNews.do?auditingAction=invalidation',
							success : function(formPanel, action) {
								Ext.ux.Toast.msg('操作信息', '操作成功！'); 
						 
								NewsGrid.getStore().reload(); 
								Ext.getCmp('NewsAuditingForm'+suffix).close();
							},
							failure : function(formPanel, action) {
								Ext.MessageBox.show({
											title : '操作信息',
											msg : '操作出错，请联系管理员！',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});
							 	NewsGrid.getStore().reload();
								Ext.getCmp('NewsAuditingForm'+suffix).close();
							}
						});// success结束
					}// if结束

				}
			} 
		this.buttons = [this.buttons,this.btnInvalidation,this.btnClose];
		// 初始化功能按钮
		// this.buttons = [{}, {}, {}]
 
	}// end of the initUIComponents

});

NewsAuditingForm.prototype.setup = function() {　
		var actionFlag = this.actionFlag;
	 	var suffix=this.suffix;
  /*	var _url = __ctxPath + '/info/treeNewsType.do?opt=treeSelector';
	var newsTypeSelector = new TreeSelector('newsTypeSelect', _url, '公司/部门',// 新闻类型
			'typeId', false);*/
 	var formPanel = new Ext.FormPanel({
				url : __ctxPath + '/info/updateNews.do?auditingAction=agree',
				layout : 'form',
				id : 'NewsAuditingForm.NewsAuditingForm'+suffix,
				frame : false,
				bodyStyle : 'padding:5px;',
				labelWidth : 55,
				formId : 'NewsAuditingFormId',
				// defaultType : 'textfield',
				defaultType : 'displayfield',
				items : [{
							name : 'news.newsId',
							id : 'NewsAuditingForm.newsId'+suffix,
							xtype : 'hidden',
							value : this.newsId == null ? '' : this.newsId
						}, {
							xtype : 'hidden',
							name : 'news.issuer',
							id : 'NewsAuditingForm.issuer'+suffix
						}, {
							name : 'news.typeId',
							id : 'NewsAuditingForm.typeId'+suffix,
							xtype : 'hidden',
							value : this.typeId == null ? '' : this.typeId
							// add by smart on 20110512
					}	, {
							fieldLabel : '标题',
							name : 'news.subject',
							width : 400,
							height:20, 
							id : 'NewsAuditingForm.subject'+suffix,
							autoScroll:true,
							readOnly : true,
							style : 'border:1px   solid   #cccccc;'
						}, {
							fieldLabel : '作者',
							name : 'news.author',
							id : 'NewsAuditingForm.author'+suffix,
							// value : curUserInfo.fullname,
							width : 400,
							height:20, 
							readOnly : true,
							style : 'border:1px   solid   #cccccc;'
						}, {
							fieldLabel : '内容',
							name : 'news.content',
							id : 'NewsAuditingForm.content'+suffix,
							width : '550',
							height : '400', 
							readOnly : true,
							style : 'border:1px solid #cccccc;',
							autoScroll:true
					}]
			});

	return formPanel;

};
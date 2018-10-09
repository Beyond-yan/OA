/**
 * @author
 * @createtime
 * @class CusLinkmanForm
 * @extends Ext.Window
 * @description CusLinkmanForm表单
 * @company  
 */
var auditStatus;

NoticeAuditingForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) { 		
 		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		NoticeAuditingForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'NoticeAuditingForm'+this.suffix,
					iconCls:'menu-notice',
					title : '公告详细信息',
					width : 880,
					height : 550,
					items:this.formPanel,
					maximizable : true,
					border : false,
					modal : true,
					plain : true,
					buttonAlign : 'center',
					buttons :this.buttons//[this.btnAgree,this.btnDisagree,this.btnClose]
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() { 
		//var actionFlag=this.typeId;
		//var actionFlag=this.actionFlag;
		var type=this.type;

		var suffix=this.suffix;
		//初始化form表单
		this.formPanel =  new Ext.FormPanel({
				url : __ctxPath + '/info/updateNotice.do?auditingAction=agree&intType='+type,
				layout : 'form',
				id : 'NoticeAuditingForm.NoticeAuditingForm'+suffix,
				bodyStyle : 'padding:5px;',
				frame : false,
				width:480,
				formId : 'NoticeAuditingFormId',
				//defaultType : 'textfield', 
				defaultType:'displayfield',
				items : [{
							name : 'notice.noticeId',
							id : 'NoticeAuditingForm.noticeId'+suffix,
							xtype : 'hidden',
							value : this.noticeId == null ? '' : this.noticeId
						},  {
							name : 'notice.type',
 							xtype : 'hidden',
							value : type
						},{
							fieldLabel : '发布者',
							name : 'notice.postName',
							id : 'NoticeAuditingForm.postName'+suffix,
							allowBlank : false,
							blankText : '发布者不能为空',
							anchor:'98%',
							height:20,
							value : curUserInfo.fullname,							
							 readOnly:true,
							 style:'border:1px   solid   #cccccc;',
							disabled:this.auditingStatus
						}, {
							fieldLabel : '公告标题',
							name : 'notice.noticeTitle',
							id : 'NoticeAuditingForm.noticeTitle'+suffix,
							allowBlank : false,
							blankText : '公告标题不能为空',
							anchor:'98%',
							height:20,
							 //readOnly:true,
							 style:'border:1px   solid   #cccccc;',
							disabled:this.auditingStatus
						}, {
							fieldLabel : '公告内容',
							name : 'notice.noticeContent',
							id : 'NoticeAuditingForm.noticeContent'+suffix,
							//xtype : 'fckeditor',
							height : 300,
							allowBlank : false,
							blankText : '公告内容不能为空',
							anchor:'98%',
							//readOnly:true,
							 style:'border:1px   solid   #cccccc;',
							 autoScroll: true,
							disabled:this.auditingStatus
						}, {
							fieldLabel : '生效日期',
							name : 'notice.effectiveDate',
							id : 'NoticeAuditingForm.effectiveDate'+suffix,
							xtype : 'datefield',
 							format : 'Y-m-d',
							//xtype:'displayfield', 
							 //readOnly:true,
 							 editable:false,
							 style:'border:1px   solid   #cccccc;',
							anchor:'98%',
							disabled:this.auditingStatus
						}, {
							fieldLabel : '失效日期',
							name : 'notice.expirationDate',
							id : 'NoticeAuditingForm.expirationDate'+suffix,
 							xtype : 'datefield',
 							format : 'Y-m-d',
							//xtype:'displayfield', 
							 //readOnly:true,
 							 editable:false,
							 style:'border:1px   solid   #cccccc;',
							anchor:'98%',
							disabled:this.auditingStatus
						}, 
						{
				           	 xtype : 'combo',
				           	 fieldLabel: '发布状态',
				           	 allowBlank:false,
				             hiddenName: 'notice.state',
				             id:'NoticeAuditingForm.state'+suffix,
				             emptyText : '请选择发布状态',
				             mode : 'local',
							 editable : false, 
							 triggerAction : 'all',
							 store : [['0','草稿'],['1','立即发布'],['2','失效']],
							 anchor:'98%',
							 value : '1',
							 //readOnly:true,
							 style:'border:1px   solid   #cccccc;',
							disabled:this.auditingStatus
				            }

				]
			});//end of the formPanel

	if (this.noticeId != null && this.noticeId != 'undefined') {
	//	this.formPanel.getForm().load({
		this.formPanel.loadData({
					deferredRender : false,
					url : __ctxPath + '/info/getNotice.do?noticeId='+ this.noticeId,
					waitMsg : '正在载入数据...',
					root:'data',
					preName:'notice',
					//success : function(form, action) {
					success : function(response, options) {
					 var proJson = response.responseText;
 					proJson = eval("("+ proJson + ")");					
 					 
					var effectiveDate = proJson.data.effectiveDate;
					var effectiveDateField = Ext.getCmp('NoticeAuditingForm.effectiveDate'+suffix);
 						var expirationDate = proJson.data.expirationDate;
  						var expirationDateField = Ext.getCmp('NoticeAuditingForm.expirationDate'+suffix);
						if(effectiveDate!=null)
						{
						 effectiveDateField.setValue(new Date(getDateFromFormat(effectiveDate, "yyyy-MM-dd HH:mm:ss")));
						} 
						if(expirationDate!=null){
						 expirationDateField.setValue(new Date(getDateFromFormat(expirationDate, "yyyy-MM-dd HH:mm:ss")));
						}	
   /* 	 			var effectiveDate = action.result.data.effectiveDate;
					var effectiveDateField = Ext.getCmp('NoticeAuditingForm.effectiveDate'+suffix);
 						var expirationDate = action.result.data.expirationDate;
 						var expirationDateField = Ext.getCmp('NoticeAuditingForm.expirationDate'+suffix);
 						
//						effectiveDateField.setValue(new Date(getDateFromFormat(effectiveDate, "yyyy-MM-dd HH:mm:ss")));
						
						if(effectiveDate!=null)
						{
						 effectiveDateField.setValue(new Date(getDateFromFormat(effectiveDate, "yyyy-MM-dd HH:mm:ss")));
						} 
						if(expirationDate!=null){
						 expirationDateField.setValue(new Date(getDateFromFormat(expirationDate, "yyyy-MM-dd HH:mm:ss")));
						}*/
					},
					failure : function(form, action) {
						Ext.ux.Toast.msg('编辑', '载入失败');
					}
				});
	};//loal formPanel
		
			//声明一个数组,用于容纳 按钮
		this.buttons=[];
		if(this.auditingStatus==0){
		 this.btnAgree={
					text : '同意',
					iconCls : 'btn-save',
					handler : function() {
						var fp = Ext.getCmp('NoticeAuditingForm.NoticeAuditingForm'+suffix);
						if (fp.getForm().isValid()) {
							fp.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg("操作信息","成功保存信息！"); 
/*									var CNA_NoticeGrid=Ext.getCmp('CNA_NoticeGrid'); //company
									var DNA_NoticeGrid=Ext.getCmp('DNA_NoticeGrid'); //department
									if(actionFlag==0)
									{
										CNA_NoticeGrid.getStore().reload();  
									}
									if(actionFlag==1)
									{
										DNA_NoticeGrid.getStore().reload(); 
									}*/
									var myButton = Ext.getCmp('noticeAuditingVSearchBtn'+suffix);
									myButton.handler.call(myButton.scope, myButton, Ext.EventObject);	
//									var NoticeGrid=Ext.getCmp('NoticeAuditingView.NoticeGrid'+suffix); //
//									NoticeGrid.getStore().reload();
									Ext.getCmp('NoticeAuditingForm'+suffix).close();
								},
								failure : function(fp, action) {
									Ext.MessageBox.show({
												title : '操作信息',
												msg : '信息保存出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
											});
									Ext.getCmp('NoticeAuditingForm'+suffix).close();
								}
							});
						}
					}
				}
  	this.btnDisagree={ 
					text : '拒绝',
					iconCls : 'btn-delete',
					handler : function() {
						var fp = Ext.getCmp('NoticeAuditingForm.NoticeAuditingForm'+suffix);
						 
						if (fp.getForm().isValid()) {
							fp.getForm().submit({
								waitMsg : '正在提交操作...',
								url : __ctxPath
										+ '/info/updateNotice.do?auditingAction=disagree&intType='+type, 
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '操作成功！');
									var myButton = Ext.getCmp('noticeAuditingVSearchBtn'+suffix);
									myButton.handler.call(myButton.scope, myButton, Ext.EventObject);										 									
//									var NoticeGrid=Ext.getCmp('NoticeAuditingView.NoticeGrid'+suffix); //
//									NoticeGrid.getStore().reload();
									Ext.getCmp('NoticeAuditingForm'+suffix).close();
									
								},
								failure : function(fp, action) {
									Ext.MessageBox.show({
												title : '操作信息',
												msg : '操作出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
											});
									Ext.getCmp('NoticeAuditingForm'+suffix).close();
								}
							});
						}
					}
			}
			
	
 			
			this.buttons=[this.btnAgree,this.btnDisagree];
		}
		
  	this.btnInvalidation={ 
					text : '失效',
					iconCls : 'btn-delete',
					handler : function() {
						var fp = Ext.getCmp('NoticeAuditingForm.NoticeAuditingForm'+suffix);
 						if (fp.getForm().isValid()) {
							fp.getForm().submit({
								waitMsg : '正在提交操作...',
								url : __ctxPath
										+ '/info/updateNotice.do?auditingAction=invalidation&intType='+type, 
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '操作成功！');
									var myButton = Ext.getCmp('noticeAuditingVSearchBtn'+suffix);
									myButton.handler.call(myButton.scope, myButton, Ext.EventObject);	
//									var NoticeGrid=Ext.getCmp('NoticeAuditingView.NoticeGrid'+suffix); //
//									NoticeGrid.getStore().reload();  
									Ext.getCmp('NoticeAuditingForm'+suffix).close(); 
								},
								failure : function(fp, action) {
									Ext.MessageBox.show({
												title : '操作信息',
												msg : '操作出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
											});
									Ext.getCmp('NoticeAuditingForm'+suffix).close();
								}
							});
						}
					}
			}
	 this.btnClose={  
					text : '关闭',
 					handler : function() {
						Ext.getCmp('NoticeAuditingForm'+suffix).close();
					}
				}
			 this.buttons=[this.buttons,this.btnInvalidation,this.btnClose];
				//end of the buttons
	}//end of the initUIComponents
});

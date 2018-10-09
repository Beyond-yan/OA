/**
 * @author
 * @createtime
 * @class CusLinkmanForm
 * @extends Ext.Window
 * @description CusLinkmanForm表单
 * @company  
 */
NoticeForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
  		Ext.applyIf(this, _cfg);
 		// 必须先初始化组件
		this.initUIComponents();
		NoticeForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'NoticeFormWin'+this.suffix,
					iconCls:'menu-notice',
					title : '公告详细信息',
					width : 880,
					height : 500,
					items:this.formPanel,
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
		//var actionFlag=this.actionFlag;
		var type=this.type;
 		var suffix=this.suffix;
 		var createuser=this.createuser;
 		//初始化form表单
		this.formPanel =  new Ext.FormPanel({
				url : __ctxPath + '/info/saveNotice.do?intType='+this.type,
				layout : 'form',
				id : 'NoticeForm'+suffix,
				bodyStyle : 'padding:5px;',
				frame : false,
				width:480,
				formId : 'NoticeFormId',
				reader : new Ext.data.JsonReader({
						root : 'data'
					}, [{
								name : 'notice.noticeId',
								mapping : 'noticeId'
							}, {
								name : 'notice.createUser',
								mapping : 'createUser'
							}, {
								name : 'notice.type',
								mapping : 'type'
							}, {
								name : 'notice.postName',
								mapping : 'postName'
							}, {
								name : 'notice.noticeTitle',
								mapping : 'noticeTitle'
							}, {
								name : 'notice.noticeContent',
								mapping : 'noticeContent'
							}, {
								name : 'notice.fileIds',
								mapping : 'fileIds'
							}, {
								name : 'notice.auditingStatus',
								mapping : 'auditingStatus'
							}, {
								name : 'notice.effectiveDate',
								mapping : 'effectiveDate'
							}, {
								name : 'notice.expirationDate',
								mapping : 'expirationDate'
							}, {
								name : 'notice.state',
								mapping : 'state'
							}, {
								name : 'notice.createtime',
								mapping : 'createtime'
							}]),
				//defaultType : 'textfield',//容器的默认类型
				items : [{
							name : 'notice.noticeId',
							id : 'NoticeForm.noticeId'+suffix,
							xtype : 'hidden',
							value : this.noticeId == null ? '' : this.noticeId
						}, {
							name : 'notice.createUser',
							xtype : 'hidden',
							id:'NoticeForm.createUser'+suffix,
							value :curUserInfo.username
						}, {
							name : 'notice.type',
 							xtype : 'hidden',
							value : type
						}/*, {
							name : 'notice.auditingStatus',
							xtype : 'hidden',
							value : 1
						}*/, {
//							defaultType : 'textfield',
							xtype : 'textfield',
							fieldLabel : '发布者',
							name : 'notice.postName',
							id : 'NoticeForm.postName'+suffix,
							allowBlank : false,
							blankText : '发布者不能为空',
							anchor:'98%',
							value : curUserInfo.fullname
						}, {
//							defaultType : 'textfield',
							xtype : 'textfield',
							fieldLabel : '公告标题',
							name : 'notice.noticeTitle',
							id : 'NoticeForm.noticeTitle'+suffix,
							allowBlank : false,
							blankText : '公告标题不能为空',
							anchor:'98%'
						}, {
//							defaultType : 'textfield',
							fieldLabel : '公告内容',
							name : 'notice.noticeContent',
							id : 'NoticeForm.noticeContent'+suffix,
							xtype : 'fckeditor',
							height : 200,
							allowBlank : true,//edit by smart on 20110701 这里的判断放入到保存的时候做
							//blankText : '公告内容不能为空',
							anchor:'98%'
						}, {
							layout : 'column',
							border:false,
							defaults:{border:false},
							items : [{
								columnWidth : .7,
								layout : 'form',
								border:false,
								items : [{
									fieldLabel : '附件',
									xtype : 'panel',
									id : 'NoticeForm.personFilePanel',
									frame : false,
									border:true,
									bodyStyle:'padding:4px 4px 4px 4px',
									height : 80,
									autoScroll : true,
									html : ''
								}]
							}, {
								columnWidth : .3,
								items : [{
									border:false,
									xtype : 'button',
									text : '添加附件',
									iconCls:'menu-attachment',
									handler : function() {
										var dialog = App.createUploadDialog({
											file_cat : 'document',
											judge_size : 'no',
										    upload_autostart : true,
											callback : function(data) {
												var fileIds = Ext.getCmp("NoticeForm.fileIds");
												var filePanel = Ext.getCmp('NoticeForm.personFilePanel');
												for (var i = 0; i < data.length; i++) {
													if (fileIds.getValue() != '') {
														fileIds.setValue(fileIds.getValue() + ',');
													}
													fileIds.setValue(fileIds.getValue() + data[i].fileId);
													Ext.DomHelper.append(
														filePanel.body,
														'<span><a href="#" onclick="FileAttachDetail.show('
																+ data[i].fileId
																+ ')">'
																+ data[i].filename
																+ '</a> <img class="img-delete" src="'
																+ __ctxPath
																+ '/images/system/delete.gif" onclick="removeFile(this,'
																+ data[i].fileId
																+ ')"/>&nbsp;|&nbsp;</span>'
													);
												}
											}
										});
										dialog.show(this);
									}
								}, {
									xtype : 'button',
									text : '清除附件',
									iconCls : 'reset',
									handler : function() {
										var fileAttaches = Ext.getCmp("NoticeForm.fileIds");
										var filePanel = Ext.getCmp('NoticeForm.personFilePanel');

										filePanel.body.update('');
										fileAttaches.setValue('');
									}
								}, {
									xtype : 'hidden',
									id : 'NoticeForm.fileIds',
									name : 'fileIds'
								}]
							}]
						}, {
							fieldLabel : '发布日期',
							name : 'notice.createtime',
							style:'margin-left:2px;',
							format : 'Y-m-d',
							id : 'NoticeForm.createtime'+suffix,
							editable : false,
							xtype : 'datetimefield',
							format : 'Y-m-d H:i:s',
							anchor:'50%',
							value:new Date(),
							allowBlank : false
						}/*, {
//							defaultType : 'textfield',
							fieldLabel : '序号',
							name : 'notice.auditingStatus',
							id : 'NoticeForm.auditingStatus'+suffix,
							blankText : '序号不能为空',
							xtype : 'numberfield',
							anchor:'98%',
							allowBlank : false
						}, {
//							defaultType : 'textfield',
							fieldLabel : '生效日期',
							name : 'notice.effectiveDate',
							id : 'NoticeForm.effectiveDate'+suffix,
							xtype : 'datefield',
							format : 'Y-m-d',
							editable:false,
							anchor:'98%',
							value:new Date()
						}, {
//							defaultType : 'textfield',
							fieldLabel : '失效日期',
							name : 'notice.expirationDate',
							id : 'NoticeForm.expirationDate'+suffix,
							xtype : 'datefield',
							format : 'Y-m-d',
							editable:false,
							anchor:'98%'
						}, 
						{
//							defaultType : 'textfield',
				           	 xtype : 'combo',
				           	 fieldLabel: '发布状态',
				           	 allowBlank:false,
				             hiddenName: 'notice.state',
				             id:'NoticeForm.state'+suffix,
				             emptyText : '请选择发布状态',
				             mode : 'local',
							 editable : false,
							 triggerAction : 'all',
							 store : [['0','草稿'],['1','生效']],
							 anchor:'98%',
							 value : '1'
				            } */ 
				]
			});//end of the formPanel

	if (this.noticeId != null && this.noticeId != 'undefined') {
		this.formPanel.getForm().load({
//		this.formPanel.loadData({
//					deferredRender : false,
					url : __ctxPath + '/info/getNotice.do?noticeId='+ this.noticeId,
//					root:'data',
//					preName:'notice',
					method:'post',
					waitMsg : '正在载入数据...',
					success : function(form, action) {
//					success : function(response,options) { 
			 	var proJson = Ext.decode(action.response.responseText).data[0];
//				proJson = eval("("+ proJson + ")");
				/*var effectiveDate = proJson.effectiveDate;
				var effectiveDateField = Ext.getCmp('NoticeForm.effectiveDate'+suffix);
					var expirationDate = proJson.expirationDate;
					var expirationDateField = Ext.getCmp('NoticeForm.expirationDate'+suffix);
					alert(effectiveDate!=null);
					if(effectiveDate!=null)
					{alert(effectiveDate);
//						effectiveDateField.setvalue(effectiveDate);
						effectiveDateField.setValue(new Date(getDateFromFormat(effectiveDate, "yyyy-MM-dd")));
					}
					if(expirationDate!=null){
//						expirationDateField.setValue(expirationDate);
						expirationDateField.setValue(new Date(getDateFromFormat(expirationDate, "yyyy-MM-dd")));
					}*/
				var data = Ext.decode(action.response.responseText).data[0];
				var filePanel = Ext.getCmp('NoticeForm.personFilePanel');
				var fileIds = Ext.getCmp("NoticeForm.fileIds");
//				Ext.getCmp('NoticeForm.folderId').setValue(folderId);
				var af = Ext.decode(action.response.responseText).data[0].attachFiles;
				if (af != null) {
						for (var i = 0; i < af.length; i++) {
							if (fileIds.getValue() != '') {
								fileIds.setValue(fileIds.getValue() + ',');
							}
							fileIds.setValue(fileIds.getValue() + af[i].fileId);
							Ext.DomHelper
									.append(
											filePanel.body,
											'<span><a href="#" onclick="FileAttachDetail.show('
													+ af[i].fileId
													+ ')">'
													+ af[i].fileName
													+ '</a><img class="img-delete" src="'
													+ __ctxPath
													+ '/images/system/delete.gif" onclick="removeFile(this,'
													+ af[i].fileId
													+ ')"/>&nbsp;|&nbsp;</span>');
						}
					}
					
/*						var effectiveDate = action.result.data.effectiveDate;
						var effectiveDateField = Ext.getCmp('effectiveDate'+suffix);
						var expirationDate = action.result.data.expirationDate;
						var expirationDateField = Ext.getCmp('expirationDate'+suffix);
						effectiveDateField.setValue(new Date(getDateFromFormat(effectiveDate, "yyyy-MM-dd HH:mm:ss")));
						if(expirationDate!=null){
						 expirationDateField.setValue(new Date(getDateFromFormat(expirationDate, "yyyy-MM-dd HH:mm:ss")));
						}*/
					},
					failure : function(form, action) {
						Ext.ux.Toast.msg('编辑', '载入失败');
					}
				});
	};//loal formPanel.
	
	//var actionFlag=this.actionFlag;
	//声明一个数组,用于容纳 按钮
	this.buttons=[];
	 if(this.addType==1||this.addType==2)
	{
				this.buttons = [ {
					text : '关闭',
					iconCls : '',
					handler : function() {
						Ext.getCmp('NoticeFormWin'+suffix).close();
					}
				}];
	}
	else{// if(this.auditingStatus==0){
     var hidden=true; 
		if(this.createuser==1)
		hidden=false;
		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					hidden:hidden,
					handler : function() {
						//以下为判断文本输入框是否输入为空
						var oEditor = FCKeditorAPI.GetInstance('NoticeForm.noticeContent'+suffix) ; 
					 	// Get the Editor Area DOM (Document object).
						var oDOM = oEditor.EditorDocument ; 
						var iLength ; 
						var firstContent;
						// The are two diffent ways to get the text (without HTML markups).
						// It is browser specific. 
						if ( document.all )		// If Internet Explorer.
						{
							//iLength = oDOM.body.innerText.length ; 
							iLength = oDOM.body.innerHTML.length ;
							firstContent=oDOM.body.innerHTML;
							//alert("oDOM.body.innerHTML: "+oDOM.body.innerHTML)
						}
						else					// If Gecko.
						{
							var r = oDOM.createRange() ;
							r.selectNodeContents( oDOM.body ) ;
							iLength = r.toString().length ; 
							
							firstContent= r.toString();
						}
						var noticeTitle=Ext.getCmp('NoticeForm.noticeTitle'+suffix);
						
						var fp = Ext.getCmp('NoticeForm'+suffix); 
						if (fp.getForm().isValid()) {
/*							if(iLength==0||firstContent=='<P></P>')
							{
								Ext.MessageBox.show({
										title : '操作信息',
										msg : '内容输入框不允许为空！',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-warning'
									});
								return ;
							}*/
 							if(noticeTitle.getValue().trim()=='')
							{
								Ext.MessageBox.show({
										title : '操作信息',
										msg : '公告标题输入框不允许为空！',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-warning'
									});
								return ;
							}
 							fp.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg("操作信息","成功保存信息！");
									var noticeFormWin=Ext.getCmp('NoticeFormWin'+suffix);
									var myButton = Ext.getCmp('noticeViewSearchBtn'+suffix);
									myButton.handler.call(myButton.scope, myButton, Ext.EventObject);	
		 							//var noticeGrid= Ext.getCmp('NoticeGrid'+ suffix);
  									//var departmentGrid=Ext.getCmp('D_NoticeGrid'+suffix); 
									//var departmentGrid=Ext.getCmp('NoticeGrid'+suffix); 
								/*	if(actionFlag==0)
									{*/
									//noticeGrid.getStore().reload();  
									/*}
									if(actionFlag==1)
									{
										noticeGrid.getStore().reload(); 
									}*/
									Ext.getCmp('NoticeFormWin'+suffix).close();
								},
								failure : function(fp, action) {
									Ext.MessageBox.show({
												title : '操作信息',
												msg : '信息保存出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
											});
									Ext.getCmp('NoticeFormWin'+suffix).close();
								}
							});
						}
					}
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : function() {
						Ext.getCmp('NoticeFormWin'+suffix).close();
					}
				}];//end of the buttons
		
	}

		
	}//end of the initUIComponents
});
function removeFile(obj, fileId) {
	var fileIds = Ext.getCmp("NoticeForm.fileIds");
	var value = fileIds.getValue();
	if (value.indexOf(',') < 0) {// 仅有一个附件
		fileIds.setValue('');
	} else {
		value = value.replace(',' + fileId, '').replace(fileId + ',', '');
		fileIds.setValue(value);
	}

	var el = Ext.get(obj.parentNode);
	el.remove();
};

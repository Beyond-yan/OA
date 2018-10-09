/**
 * @author LiuSicen
 * @createtime
 * @extends Ext.Window
 * @description 党群信息表单
 * @company  
 */
PartyInfoForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
  		Ext.applyIf(this, _cfg);
 		// 必须先初始化组件
		this.initUIComponents();
		PartyInfoForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'PartyInfoFormWin',
					iconCls : 'menu-flowPr',
					title : '党群详细信息',
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
 		//初始化form表单
		this.formPanel =  new Ext.FormPanel({
				url : __ctxPath + '/info/saveNotice.do?intType=2',
				layout : 'form',
				id : 'PartyInfoForm',
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
								name : 'notice.infoType.typeid',
								mapping : 'infoTypeId'
							}, {
								name : 'notice.effectiveDate',
								mapping : 'effectiveDate'
							}, {
								name : 'notice.expirationDate',
								mapping : 'expirationDate'
							}, {
								name : 'notice.state',
								mapping : 'state'
							}]),
				items : [{
							name : 'notice.noticeId',
							id : 'PartyInfoForm.noticeId',
							xtype : 'hidden',
							value : this.noticeId == null ? '' : this.noticeId
						}, {
							name : 'notice.createUser',
							xtype : 'hidden',
							id:'PartyInfoForm.createUser',
							value :curUserInfo.username
						}, {
							xtype : 'textfield',
							fieldLabel : '发布者',
							name : 'notice.postName',
							id : 'PartyInfoForm.postName',
							allowBlank : false,
							blankText : '发布者不能为空',
							anchor:'98%',
							value : curUserInfo.fullname
						}, {
							xtype : 'textfield',
							fieldLabel : '主题',
							name : 'notice.noticeTitle',
							id : 'PartyInfoForm.noticeTitle',
							allowBlank : false,
							blankText : '主题不能为空',
							anchor:'98%'
						}, {
							fieldLabel : '内容',
							name : 'notice.noticeContent',
							id : 'PartyInfoForm.noticeContent',
							xtype : 'fckeditor',
							height : 200,
							allowBlank : true,
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
									id : 'PartyInfoForm.personFilePanel',
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
												var fileIds = Ext.getCmp("PartyInfoForm.fileIds");
												var filePanel = Ext.getCmp('PartyInfoForm.personFilePanel');
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
										var fileAttaches = Ext.getCmp("PartyInfoForm.fileIds");
										var filePanel = Ext.getCmp('PartyInfoForm.personFilePanel');

										filePanel.body.update('');
										fileAttaches.setValue('');
									}
								}, {
									xtype : 'hidden',
									id : 'PartyInfoForm.fileIds',
									name : 'fileIds'
								}]
							}]
						}, {
							xtype : 'combo',
				           	 fieldLabel: '信息分类',
				           	 allowBlank:false,
				             hiddenName: 'notice.infoType.typeid',
				             emptyText : '请选择信息类型',
				             displayField : 'typeName',
				             valueField : 'typeId',
							 editable : false,
							 triggerAction : 'all',
							 store : new Ext.data.SimpleStore({
									url : __ctxPath
									+ '/info/comboInfoType.do',
								autoLoad : true,
								fields : ['typeId', 'typeName']
							}),
							 anchor:'98%'
						},{
							xtype:'hidden',
							name :'notice.type',
							value:2
						}
				]
			});//end of the formPanel

	if (this.noticeId != null && this.noticeId != 'undefined') {
		this.formPanel.getForm().load({
					url : __ctxPath + '/info/getPartyDetailNotice.do?noticeId='+ this.noticeId,
					method:'post',
					waitMsg : '正在载入数据...',
					success : function(form, action) {
			 	var proJson = Ext.decode(action.response.responseText).data[0];
				var data = Ext.decode(action.response.responseText).data[0];
				var filePanel = Ext.getCmp('PartyInfoForm.personFilePanel');
				var fileIds = Ext.getCmp("PartyInfoForm.fileIds");
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
					},
					failure : function(form, action) {
						Ext.ux.Toast.msg('编辑', '载入失败');
					}
				});
	};//loal formPanel.
	this.buttons=[];
	 if(this.addType==1||this.addType==2)
	{
		this.buttons = [ {
			text : '关闭',
			iconCls : '',
			handler : function() {
				Ext.getCmp('PartyInfoFormWin').close();
			}
		}];
	}
	else{
     var hidden=true; 
		if(this.createuser==1)
		hidden=false;
		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					hidden:hidden,
					handler : function() {
						//以下为判断文本输入框是否输入为空
						var oEditor = FCKeditorAPI.GetInstance('PartyInfoForm.noticeContent') ; 
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
						var noticeTitle=Ext.getCmp('PartyInfoForm.noticeTitle');
						
						var fp = Ext.getCmp('PartyInfoForm'); 
						if (fp.getForm().isValid()) {
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
									var myButton = Ext.getCmp('PartyInfoViewSearchBtn');
									myButton.handler.call(myButton.scope, myButton, Ext.EventObject);
									Ext.getCmp('PartyInfoFormWin').close();
								},
								failure : function(fp, action) {
									Ext.MessageBox.show({
												title : '操作信息',
												msg : '信息保存出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
											});
									Ext.getCmp('PartyInfoFormWin').close();
								}
							});
						}
					}
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : function() {
						Ext.getCmp('PartyInfoFormWin').close();
					}
				}];//end of the buttons
		
	}

		
	}//end of the initUIComponents
});
function removeFile(obj, fileId) {
	var fileIds = Ext.getCmp("PartyInfoForm.fileIds");
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

/**
 * @author ropen
 * @createtime
 * @class ArchivesDocForm
 * @extends Ext.Window
 * @description ArchivesDoc表单
 */
ArchivesDocForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ArchivesDocForm.superclass.constructor.call(this, {
					id : 'ArchivesDocFormWin',
					layout : 'fit',
					border : false,
					items : this.formPanel,
					modal : true,
					height : 650,
					width : 800,
					iconCls : 'btn-archive-attachment',
					maximizable : true,
					title : '发文附件',
					buttonAlign : 'center',
					buttons : this.buttons,
					draggable:false
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		var suffix =this.docName.split(".")[1].toLowerCase();
		var isShift=true;
		if(this.archives!=null&&this.archives.archType==3){
			isShift=false;
		}
		if(suffix=='pdf'){
			isShift=true;
		}
		this.docPanel = new NtkOfficePanel({
							showToolbar : true,
							unshowMenuBar:false,
							fileId:this.fileId,
							status : this.status,
							//autoHeight : true,
							idoc:this.idoc,
							docName:this.docName,
							archives:this.archives,
							height : 750
						});
		this.formPanel = new Ext.FormPanel({
					layout : 'form',
					frame : true,
					url : __ctxPath + '/archive/saveArchivesDoc.do',
					id : 'ArchivesDocForm',
					defaults : {
						anchor : '100%,100%'
					},
					items : [{
								name : 'archivesDoc.docId',
								id : 'docId',
								xtype : 'hidden',
								value : this.docId == null ? '' : this.docId
							}, {
								xtype : 'hidden',
								name : 'archivesDoc.fileId',
								id : 'fileId'
							}, {
								fieldLabel : '文档名称',
								name : 'archivesDoc.docName',
								xtype : 'hidden',
								value:this.docName,
								allowBlank : false
							}, {
								xtype : 'hidden',
								fieldLabel : '文档路径',
								name : 'archivesDoc.docPath'
							},this.docPanel.panel]
				});
		// 加载表单对应的数据
		/*if (this.docId && this.docId != 0) {
			this.formPanel.getForm().load({
				//deferredRender : false,
				url : __ctxPath + '/archive/getArchivesDoc.do?docId='
						+ this.docId,
				waitMsg : '正在载入数据...'
			});
		}*/
		/*// 初始化功能按钮
		this.buttons = [{
			        text: '<div style="background:url(images/btn/archive/doc_save.png); width:80px;height:31px;background-repeat: no-repeat"></div>',
					scale :"middle",
                                        style:'width:80px;height:33px;padding:0;',
					scope : this,
					handler : this.onSave
				},  {
					text: '<div style="background:url(images/btn/archive/doc_cancel.png); width:80px;height:31px;background-repeat: no-repeat"></div>',
					scale :"middle",
                                        style:'width:80px;height:33px;padding:0;',
					scope : this,
					handler : this.onCancel
				}];*/
                // 初始化功能按钮
		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
                    style:'width:70px;height:31px;padding:0;',
					scope : this,
					hidden : suffix=='pdf'?true:false, 
					handler : this.onSave
				},  {
					text : '转换为PDF',
					iconCls : 'btn-save',
                    style:'width:70px;height:31px;padding:0;',
					scope : this,
					hidden : isShift, 
					handler : this.onWordToPDF
				},{
					text : '取消',
					iconCls : 'btn-cancel',
					style:'width:70px;height:31px;padding:0;',
					scope : this,
					handler : this.onCancel
				}];
	},// end of the initcomponents

	// overwrite the show method
	show : function() {
		ArchivesDocForm.superclass.show.call(this);
		this.maximize();
		if(this.fileId){
			//this.docPanel.openDoc(this.fileId);
		}
	},

	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	onCancel : function() {
		this.close();
	},
	/**
	 * 保存记录
	 */
	onSave : function() {
		// 取到当前窗口对象
		var curWin = this;
		var callback = this.callback;
		if (this.formPanel.getForm().isValid()) {
					var docPath = null;
					var fileId = null;
					var docName = this.formPanel.getCmpByName('archivesDoc.docName').getValue();
					var obj = this.docPanel.saveDoc({
								fileId : fileId,
								docName : docName,
								//doctype : 'doc',
								present:this
							});
					if(obj!=null){
						if (obj && obj.success) {
							fileId = obj.fileId;
						   	docPath = obj.filePath;
						    this.formPanel.getCmpByName('archivesDoc.docPath').setValue(docPath);
						} else {
							Ext.ux.Toast.msg('操作信息', '保存文档出错！');
							return;
						}
						this.formPanel.getForm().submit({
							method : 'POST',
							// waitMsg : '正在提交数据...',
							params : {
								docPath : docPath,
								fileId : fileId
							},
							success : function(fp, action) {
								Ext.ux.Toast.msg('操作信息', '成功保存附加文档！');
								var result = Ext.util.JSON.decode(action.response.responseText);
								// 把添加的文档记录实体返回
								if(callback){
									callback.call(this, result.data);
								}					
								curWin.close();
								ntkoSealPath="";
							},
							failure : function(fp, action) {
								Ext.MessageBox.show({
											title : '操作信息',
											msg : '信息保存出错，请联系管理员！',
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
							}
						});
					}
		}
	},// end of save
	/**
	 * 转换为pdf
	 */
	onWordToPDF : function() {
		var form1=this.formPanel;
		var panel1=this.docPanel;
		// 取到当前窗口对象11111111111111111
		var curWin = this;
		var callback = this.callback;
		Ext.Msg.confirm('信息确认', '转换为PDF格式后将无法继续编辑！！！', function(btn) {
			if (btn == 'yes') {
				if (form1.getForm().isValid()) {
					var docPath = null;
					var fileId = null;
					var docName =form1.getCmpByName('archivesDoc.docName').getValue();
					var obj = panel1.wordToPDF({
								fileId : fileId,
								docName : docName,
								doctype : 'doc',
								present:curWin
							});
					if(obj!=null){
					if (obj && obj.success) {
						fileId = obj.fileId;
					   	docPath = obj.filePath;
					   	form1.getCmpByName('archivesDoc.docPath').setValue(docPath);
					} else {
						Ext.ux.Toast.msg('操作信息', '保存文档出错！');
						return;
					}
					
					form.getForm().submit({
						method : 'POST',
						// waitMsg : '正在提交数据...',
						params : {
							docPath : docPath,
							fileId : fileId
						},
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '成功保存附加文档！');
							var result = Ext.util.JSON.decode(action.response.responseText);
							// 把添加的文档记录实体返回
							if(callback){
								callback.call(this, result.data);
							}					
							curWin.close();
							ntkoSealPath="";
						},
						failure : function(fp, action) {
							Ext.MessageBox.show({
										title : '操作信息',
										msg : '信息保存出错，请联系管理员！',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
					}
				}
			}
		});
	},// end of save
	/**
	 * 插入附加文件记录
	 * 
	 * @param {}
	 *            store
	 * @param {}
	 *            archivesDoc
	 */
	insertNewDoc : function(store, archivesDoc) {
		var orec;
		//alert(archivesDoc.fileId);
		if (store.recordType) {
			orec = new store.recordType();
			orec.data = {};
			orec.data['docId'] = archivesDoc.docId;
			orec.data['fileId'] = archivesDoc.fileId;
			orec.data['docPath'] = archivesDoc.docPath;
			orec.data['docName'] = archivesDoc.docName;
			orec.data['curVersion'] = archivesDoc.curVersion
					? archivesDoc.curVersion
					: 1;
			orec.data.newRecord = true;
			orec.commit();
			store.add(orec);
		}
	}
});

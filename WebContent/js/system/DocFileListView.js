/**
 * @author
 * @createtime
 * @class DocFileListView
 * @extends Ext.Window
 * @description RollFileList表单
 * @company 宏天软件
 */
DocFileListView = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DocFileListView.superclass.constructor.call(this, {
					id : 'DocFileListViewWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					height : 350,
					width : 500,
					maximizable : true,
					title : '附件详细信息',
					buttonAlign : 'center',
					buttons : [{
								text : '确定',
								iconCls : 'btn-save',
								scope : this,
								handler : this.save
							}, {
								text : '重置',
								iconCls : 'btn-reset',
								scope : this,
								handler : this.reset
							}, {
								text : '关闭',
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
			// id : 'DocFileListView',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'displayfield',
			labelWidth :60,
			labelPad:3,
			items : [{
						fieldLabel : '主键ID',
						name : 'docFileList.id',
						xtype : 'hidden',
						value : this.id == null ? '' : this.id
					}, {
						fieldLabel : '卷ID',
						name : 'docFileList.fileId',
						allowBlank : false,
						xtype : 'hidden',value : this.fileId == null ? '' : this.fileId
					}, {
						fieldLabel : '附ID',
						id : 'docFileList.fileAttach.fileId',
						name : 'docFileList.fileId',
						allowBlank : false,
						xtype : 'hidden'

					},{
						fieldLabel : '文件名称',
						id : 'docFileList.fileAttach.fileName',
						name : 'docFileList.fileAttach.fileName',
						allowBlank : false,
						xtype : 'displayfield',
						width:261
					},{
						fieldLabel : '文件路径',xtype : 'displayfield',
						readOnly : true,
						id : 'docFileList.fileAttach.filePath',
						name : 'docFileList.fileAttach.filePath',
						allowBlank : false,
						maxLength : 256
					},

					{
						fieldLabel : '文件类型',xtype : 'displayfield',
						readOnly : true,
						name : 'docFileList.fileAttach.ext',
						maxLength : 128
					},

					{
						fieldLabel : '下载次数',
						readOnly : true,
						name : 'docFileList.downloads',
						value:0,
						xtype : 'displayfield'
					},  {
						fieldLabel : '概要',
						name : 'docFileList.fileSummary',
						xtype : 'displayfield'
					},{
						xtype : 'compositefield',
						msgTarget : 'side',
						border : true,
						fieldLabel : '录入人',
						items : [{
									
									readOnly : true,
									name : 'docFileList.fileAttach.creator',
									value : curUserInfo.fullname,
									readOnly : true,xtype : 'displayfield',
									maxLength : 128
								}, {
									xtype : 'displayfield',
									value:'录入时间:'
								},{
									//fieldLabel : '录入时间',
									readOnly : true,
									name : 'docFileList.fileAttach.createtime',
									xtype : 'displayfield',
									format : 'Y-m-d',
									readOnly : true,
									value : new Date().format('Y-m-d')
								}]
					}]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
						url : __ctxPath + '/arch/getDocFileList.do?listId='
								+ this.id,
						root : 'data',
						preName : 'docFileList'
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
		}// end of save
});
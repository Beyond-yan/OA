/**
 * @author:
 * @class OdCirUserView
 * @extends Ext.Panel
 * @description [OdCirUser]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
OdCirUserView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		OdCirUserView.superclass.constructor.call(this, {
					id : 'OdCirUserView',
					title : '我传阅的文件',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		var dataStatus = [['2', '全部'], ['1', '已阅'], ['0', '未阅']];
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
					layout : 'form',
					region : 'north',
					frame : true,
					items : [{
						layout : 'column',
						items : [{
									columnWidth : 0.5,
									layout : 'form',
									items : [{
												fieldLabel : '标题',
												name : 'subject',
												xtype : 'textfield'
											}]
								}, {
									columnWidth : 0.5,
									layout : 'form',
									items : [{
										fieldLabel : '状态',
										hiddenName : 'isRead',
										xtype : 'combo',
										emptyText : '请选择',
										mode : 'local',
										valueField : 'value',
										displayField : 'display',
										editable : false,
										width:125,
										triggerAction : 'all',
										forceSelection : true,
										store : new Ext.data.SimpleStore({
													fields : ['value',
															'display'],
													data : dataStatus
												})
									}]
								}]
					},{
						layout : 'column',
						items : [{
									columnWidth : 0.5,
									layout : 'form',
									items : [{
												fieldLabel : '发件人',
												name : 'senderName',
												xtype : 'textfield'
											}]
								}, {
									columnWidth : 0.5,
									layout : 'form',
									items : [{
												fieldLabel : '收件人',
												name : 'recName',
												xtype : 'textfield'
											}]
								}]
					}],
					buttons : [{
								text : '查询',
								scope : this,
								iconCls : 'btn-search',
								handler : this.search
							}, {
								text : '重置',
								scope : this,
								iconCls : 'btn-reset',
								handler : this.reset
							}]
				});// end of searchPanel

		var store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath
										+ "/archive/searchSenderOdCirUser.do"
							}),
					autoLoad:true,
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								fields : [
								          {
											name : 'cirPaperId',
											type : 'int'
										}, 'subject' /*'path',*/
										/*'cirPaperId',
										'sendUser.fullname',
										'recUser.fullname', 'isRead',
										'readDate'*/]
							}),
					remoteSort : true
				});
		this.gridPanel = new Ext.grid.GridPanel({
			region : 'center',
			// 使用RowActions
			id : 'OdCirUserGrid',
			region : 'center',
			shim : true,
			autoHeight : true,
			trackMouseOver : true,
			disableSelection : false,
			loadMask : true,		
			viewConfig : {
				forceFit : true,
				enableRowBody : false,
				showPreview : false
			},
			store : store,
			fields : [
						{
							name : 'cirPaperId',
							type : 'int'
						}, 
						//			          {
						//						name : 'cirUserId',
						//						type : 'int'
						//					}, 
					'subject' /*'path' 'cirPaperId',
					'sendUser.fullname', 'recUser.fullname', 'isRead',
					'readDate'*/],
			columns : [new Ext.grid.RowNumberer(),{
						header : 'cirPaperId',
						dataIndex : 'cirPaperId',
						hidden : true
					}, {
						header : '标题',
						dataIndex : 'subject'
					}, /*{
						header : '发件人',
						dataIndex : 'sendUser.fullname'
					}, {
						header : '收件人',
						dataIndex : 'recUser.fullname'
					}, {
						header : '状态',
						dataIndex : 'isRead',
						renderer : function(value) {
							if (value == 0) {
								return '<font color="red">未阅</font>';
							} else if (value == 1) {
								return '<font color="green">已阅</font>';
							}
						}
					}, {
						header : '收阅日期',
						dataIndex : 'readDate'
					},*/ {
						header : '管理',
						width : 100,
						dataIndex : 'cirPaperId',
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var str = '';
							str += '<button title="查阅详情" value=" " class="btn-archives-detail" onclick="OdCirUserView.detail('
									+ value + ')">&nbsp;&nbsp;</button>';
							str += '<button title="表单信息" value=" " class="btn-search" onclick="OdCirUserView.formInfo('
								+ value + ')">&nbsp;&nbsp;</button>';
							return str;
						}
					}],
					bbar : new HT.PagingBar({
						store : store
					})
				// end of columns
		});
	},
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function() {
		this.searchPanel.getForm().submit({
			waitMsg : '正在提交查询',
			url : __ctxPath + "/archive/searchSenderOdCirUser.do",
			success : function(fp, action) {
				var result = Ext.util.JSON.decode(action.response.responseText);
				var gridPanel=Ext.getCmp('OdCirUserGrid');
				gridPanel.getStore().loadData(result);
			}
		});
	}
});
OdCirUserView.detail = function(editId) {
	new OdCirUserWin({
				cirPaperId : editId
			}).show();
}

OdCirUserView.formInfo=function(editId) {
	new OdCirPaperForm({
		cirPaperId : editId
	}).show();
}
Ext.ns('NoticeAuditingView');
/**
 * @author:
 * @class NoticeAuditingView
 * @extends Ext.Panel
 * @description 公告列表
 * @company  
 * @createtime:2010-04-12
 */
var suffixStr ;

NoticeAuditingView = Ext.extend(Ext.Panel, {
	// 条件搜索Panel
	searchPanel : null,
	// 数据展示Panel
	gridPanel : null,
	// GridPanel的数据Store
	store : null,
	// 头部工具栏
	topbar : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		
		NoticeAuditingView.superclass.constructor.call(this, {
					id : 'NoticeAuditingView'+this.suffix,
					title : this.title,
					iconCls : 'menu-notice',
					region : 'center',
					layout : 'border'//,
					//items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() { 
 	    //该句话是防止查询或者是删除数据的时候出现未选中数据或者是查询数据的时候出错 
		// this.newsTypeTree = new NewsTypeTree(); 
		suffixStr = this.suffix;
		var searchPanel = Ext.getCmp('NoticeAuditingView.NoticeSearchForm'+ this.suffix);
 		if(searchPanel == null){
			this.initGridPanel();  
			this.items = [// this.newsTypeTree,
			              this.gridPanel];
			} 
	}//end of the initUIComponents
});



/**
 * 显示列表
 * 
 * @return {}
 */
NoticeAuditingView.prototype.initGridPanel = function() {
	var type=this.type;
 	var suffix=this.suffix;
  	return this.gridPanel = new Ext.Panel({
		region : 'center',
		layout : 'form',
		border : false,
		anchor : '100%',
		items : [{
			items : [new Ext.FormPanel({
			id : 'NoticeAuditingView.NoticeSearchForm'+suffix,
			height : 40,
			frame : false,
			region : 'north',
			border : false,
			layout : 'hbox',
			layoutConfig : {
				padding : '5',
				align : 'middle'
			},
			defaults : {
				xtype : 'label',
				margins : {
					top : 0,
					right : 4,
					bottom : 4,
					left : 4
				}
			},
			items : [/*{
						text : '请输入查询条件:'
					},*/ {
						text : '发布者'
					}, {
						xtype : 'textfield',
						width : 80,
						name : 'Q_postName_S_LK',
						id:'NoticeAuditingView.noticeAuthor'+suffix
					}, {
						text : '标题'
					}, {
						xtype : 'textfield',
						width : 220,
						name : 'Q_noticeTitle_S_LK',
						id:'NoticeAuditingView.noticeTitle'+suffix
					},
					 {
						text : '发布状态'
					}, {
						id : 'NoticeAuditingView.noticeState'+suffix,
						xtype :'combo',
						name:'Q_state_SN_EQ',
						width:80,
						mode : 'local',
						editable : false, 
						triggerAction : 'all',
						store : [[0,'草稿'],[1, '生效'], [2, '失效']],
						value:1
						},
					{
						text : '审核状态'
					}, {
						id : 'NoticeAuditingView.noticeAuditingStatus'+suffix,
						xtype :'combo',
						name:'Q_auditingStatus_N_EQ',
						width:80,
						mode : 'local',
						editable : false, 
						triggerAction : 'all',
						store : [['','全部'],['0', '未审核'], ['1', '审核通过'],['2', '已拒绝']],
						value:'0'
						},{
						xtype : 'button',
						id:'noticeAuditingVSearchBtn'+suffix,
						text : '查询',
						iconCls : 'search',
						handler : function() { 
								var searchPanel = Ext.getCmp('NoticeAuditingView.NoticeSearchForm'+suffix);
								var gridPanel = Ext.getCmp('NoticeAuditingView.NoticeGrid'+suffix);
								var noticeState=Ext.getCmp('NoticeAuditingView.noticeState'+suffix); 
								var auditingStatus=Ext.getCmp('NoticeAuditingView.noticeAuditingStatus'+suffix);
//								alert('search-'+auditingStatus.value + '-'+noticeState.value);
									if (searchPanel.getForm().isValid()) {
										searchPanel.getForm().submit({
										waitMsg : '正在提交查询',
											url : __ctxPath + '/info/listNotice.do?intType='+type+'&Q_state_SN_EQ='+noticeState.value+'&actionFlag=0&intAudit=1&Q_auditingStatus_N_EQ='+auditingStatus.value,  //edit by smart on 20110511''
											success : function(formPanel, action) {
														var result = Ext.util.JSON.decode(action.response.responseText);
														gridPanel.getStore().loadData(result);
												  }
										});//success结束
									}//if结束
						}
					}, {
						xtype : 'button',
						text : '重置',
						iconCls : 'reset',
						handler : function() {
/*							var searchPanel = Ext.getCmp('NoticeSearchForm'+suffix);
							searchPanel.getForm().reset();*/
 						var searchSendPerson = Ext.getCmp('NoticeAuditingView.noticeAuthor' + suffix);
						var searchSendTitle = Ext.getCmp('NoticeAuditingView.noticeTitle'+ suffix);
						var searchAuditStatus = Ext.getCmp('NoticeAuditingView.noticeAuditingStatus'+suffix);
						
						var searchNoticeState = Ext.getCmp('NoticeAuditingView.noticeState'+suffix);
						
						searchSendPerson.setValue("");
						searchSendTitle.setValue("");
						searchAuditStatus.setValue(0);
						searchNoticeState.setValue(1);//1代表生效
					}
				}]
		}), this.setup()]
		}]
	});
 			 
 			

};

/**
 * 建立视图
 */
NoticeAuditingView.prototype.setup = function() {

	return this.grid();
};


/**
 * 建立DataGrid
 */
NoticeAuditingView.prototype.grid = function() {
	var type=this.type;
	var suffix=this.suffix; 
	//var sm = new Ext.grid.CheckboxSelectionModel();

	var cm = new Ext.grid.ColumnModel({
		columns : [  new Ext.grid.RowNumberer(), {
					header : 'noticeId',
					dataIndex : 'noticeId',
					hidden : true
				}, {
					header : '发布者',
					dataIndex : 'postName',
					width : 50,
					sortable:false
				}, {
					header : '公告标题',
					dataIndex : 'noticeTitle',
					width : 200,
					sortable:false
				}, {
					header : '发布时间',
					dataIndex : 'createtime',
					width : 100
				},{
					header : '生效日期',
					width : 80,
					dataIndex : 'effectiveDate',
					sortable:false
				}, {
					header : '失效日期',
					width : 80,
					dataIndex : 'expirationDate',
					renderer : function(value){
						if(value!=null)
						{
							return value;							
						}
						else
						{
							return "";
						}
					},
					sortable:false
				}, {
					header : '回复次数',
					width : 80,
					dataIndex : 'replyCounts'
				}, {
					header : '浏览数',
					width : 60,
					dataIndex : 'viewCounts',
					sortable:false
				}, {
					header : '发布状态',
					width : 70,
					dataIndex : 'state',
					renderer : function(value) {
						var strValue="未知";
						if(value==0)
						{
							strValue="草稿";
						}
						else if(value==1)
						{
							strValue="生效";
						}
						else if(value == 2)
						{
							strValue="<font color='red'>失效</font>";
						}
						return strValue;
					},
					sortable:false
				}, 
				{
					header : '审核状态',
					width : 70,
					dataIndex : 'auditingStatus',
					renderer : function(value) {
					var strValue="未知";
				 
						if(value==0)
						{
							strValue='未审核';
						}
						else if(value==1)
						{
							strValue='审核通过';
						}
						else if(value==2)
						{
							strValue='已拒绝';
						} 
						
						return strValue;
					},
					sortable:false
				}, 
				
				{
					header : '审核操作',
					dataIndex : 'noticeId',
					sortable : false,
					width : 80,
					renderer : function(value, metadata, record, rowIndex,
							colIndex) {
						var editId = record.data.noticeId;
						var auditingStatus =record.data.auditingStatus;//["auditingStatus"];//add by smart on 20110514
						//var actionFlag=0;

						var str = ''; 
						if (isGranted('_NoticeAuditingEdit_'+suffix)) {
							str += '&nbsp;<button title="查看" value="" class="btn-showDetail" onclick="NoticeAuditingView.edit('
									+ editId+ ','+type+','+auditingStatus+','+suffix+')"></button>';
						}
						return str;
					} 
				}],
		defaults : {
			sortable : true,
			menuDisabled : false,
			width : 100
		}
	});//end of the cm
	

	
 	var store = this.store();
 	store.load({
 		param : {
 			start : 0,
 			limit : 25
 		}
 		});

	var grid = new Ext.grid.GridPanel({
				id : 'NoticeAuditingView.NoticeGrid'+suffix,
				//tbar : this.topbar,
				autoScroll:true,
				region : 'center',
				store : store,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				height : 630,
				cm : cm,
				//sm : sm,
				viewConfig : {
					forceFit : true,
					enableRowBody : false,
					showPreview : false
				},
				bbar : new Ext.PagingToolbar({
							pageSize : 25,
							store : store,
							displayInfo : true,
							displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
							emptyMsg : "当前没有记录"
						})
			});

	grid.addListener('rowdblclick', function(grid, rowindex, e){
				grid.getSelectionModel().each(function(rec) {
							if (isGranted('_NoticeAuditingEdit_'+suffix)) {
								NoticeAuditingView.edit(rec.data.noticeId,type,rec.data.auditingStatus,suffix);
							}
						});
			});
	return grid;
};


/**
 * 初始化数据
 */
NoticeAuditingView.prototype.store = function() {
		var type=this.type;
		var auditingStatus = Ext.getCmp('NoticeAuditingView.noticeAuditingStatus'+suffixStr).getValue();
		var StateSn = Ext.getCmp('NoticeAuditingView.noticeState'+suffixStr).getValue();
//		alert('load-'+auditingStatus + '-'+StateSn);
		var store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/info/listNotice.do?intType='+type+'&actionFlag=0&intAudit=1&Q_auditingStatus_N_EQ='+auditingStatus+'&Q_state_SN_EQ='+StateSn //edit by smart on 20110511''
		}),
		reader : new Ext.data.JsonReader({
					root : 'result',
					totalProperty : 'totalCounts',
					id : 'id',
					fields : [{ name : 'noticeId',
								 type : 'int'
								}, 'postName', 'noticeTitle', 'effectiveDate',
									'expirationDate', 'state','replyCounts','viewCounts',
									{
										name : 'auditingStatus',
										type : 'int'
									} ,'createtime']
				}),
		remoteSort : true
	});
	//this.store.setDefaultSort('noticeId', 'desc');
	return store;
}; 
/**
 * 
 */
NoticeAuditingView.edit = function(id,type,auditingStatus,suffix) {
	new NoticeAuditingForm({
		noticeId : id,
		type:type,
		auditingStatus:auditingStatus,
		suffix:suffix
	}).show();
}; 

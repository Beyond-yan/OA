/**
 * @author:
 * @class ArchivesDepView
 * @extends Ext.Panel
 * @description [ArchivesDep]管理
 */
ArchivesDepView=Ext.extend(Ext.Panel,{
	//构造函数
	constructor:function(_cfg){
			if(_cfg==null){_cfg={};}
			Ext.apply(this,_cfg);
			//初始化组件
			this.initComponents();
			//调用父类构造
			ArchivesDepView.superclass.constructor.call(this,{
				id:'ArchivesDepView',
				title:'公文下载监控',
				region:'center',
				layout:'border',
				items:[this.searchPanel,this.gridPanel]
			});
	},//end of constructor
	
	
	//条件搜索Panel
	searchPanel:null, 
	
	//数据展示Panel
	gridPanel:null,
	
	//GridPanel的数据Store
	store:null,
	
	
	//初始化组件
	initComponents:function(){
		
		var archiveId=this.archiveId;
		//初始化搜索条件Panel
		this.searchPanel=new Ext.FormPanel({
		    layout : 'column',
		    region:'north',
			bodyStyle: 'padding:6px 10px 6px 10px',
			height:80,
			border:false,
			defaults:{
				border:false,
				anchor:'98%,98%'
			},
		    items : [	
					{
					columnWidth:.33,
					layout:'form',
					items:[{
						fieldLabel:'收文单位',
						name:'depName',
						xtype:'textfield',
						width:120
					},{
						fieldLabel:'签收日期',
						name:'receiveDate',
						xtype : 'datefield',
						format : 'Y-m-d',
						width:120
					}]
				},
				{
					columnWidth:.3,
					layout:'form',
					items:[{
						fieldLabel:'签收状态',//0=未签收  1=已签收',
						hiddenName:'receiveFlag',
						xtype:'combo',
						mode : 'local',
					   editable : false,
						triggerAction : 'all',
						width:120,
						store:[
						       ['0','未签收'],
						       ['1','已签收'],['2','已拒绝']
						       ]
					},{
						fieldLabel:'签收人',
						name:'receiveUserName',
						xtype:'textfield',
						width:120
					}]
				},
				{
					columnWidth:.3,
					layout:'form',
					items:[{
							xtype : 'button',
							text : '查询',
							iconCls : 'search',
							handler : this.search.createCallback(this)
		    			}, {
	    				    xtype : 'button',
							text : '重置',
							iconCls : 'btn-reset',
							handler : this.reset.createCallback(this)
						}]
				}
				]
		});//end of the searchPanel
		//加载数据至store
		this.store = new Ext.data.JsonStore({
							url : __ctxPath+'/system/listMonitorSysDataTransfer.do?archivesId='+archiveId,
							root : 'result',
							totalProperty : 'totalCounts',
							remoteSort : true,
							fields : ['id', 'archivesId', 'archivesno', 'sendDep',
							'subject', 'archtype', 'issuerid', 'issuer',
							'privacylevel', 'urgentlevel', 'sources',
							'writtenDate', 'receiveDep', 'transferType',
							'fromSchema', 'toSchemaId', 'receiveDate',
							'receiveFlag', 'rejectMsg', 'createUser',
							'createDate', 'transactionId', 'receiveUser',
							'receiveUserName','receiveType','confs.depName','confs','sourceType','sourceUser']
		});
		this.store.setDefaultSort('createDate', 'desc');
		//加载数据
		this.store.load({params : {
					start : 0,
					limit : 25
		}});
		
		//初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'archDepId',
						dataIndex : 'archDepId',
						hidden : true
					} ,{
						header : '公文标题',	
						dataIndex : 'subject',
						width : 130
		               } ,{
										header : '收文单位/人',
										dataIndex : 'confs.depName',
										renderer : function(value, metadata, record, rowIndex,colIndex) {
											var sourceType=record.data.sourceType;
											var sentUserName=record.data.urgentlevel;
											if (sourceType == '2') {
												return  sentUserName;
											} else{
												return value;
											}
										}
						},{
										header : '签收状态',//    0=未签收      1=已签收',	
										dataIndex : 'receiveFlag',
										renderer : function(value) {
											if (value == '0') {
												return "<span>未签收</span>";
											} else if(value == '1'){
												return "<span>已签收</span>";
											} else if(value=='2'){
												return "<span>已拒绝</span>";
											}
										}
						},{
										header : '签收日期',	
										dataIndex : 'receiveDate',
										width : 100
						},{
										header : '签收人',	
										dataIndex : 'receiveUserName',
										width : 80
						},{
										header : '拒绝原因',
										dataIndex : 'rejectMsg',
										renderer : function(value, metadata, record, rowIndex,colIndex){
											var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchivesDepView.idear('
													+record.data.id+')">'+(value == null ? '' : value)+'</a>';
											return str;
										}
						}/*,{
										header : '办理结果反馈',	
										dataIndex : 'handleFeedback',
										width : 150
						}*/,{
							header : '管理',
							width : 150,
							dataIndex : 'subject',
							renderer : function(value, metadata, record, rowIndex,
										colIndex) {
											var subject = value;
											var receiveDep=record.data.confs.depId;
											var receiveFlag=record.data.receiveFlag;
											var sourceType=record.data.sourceType;
											var sourceUserName=record.data.sourceUser;
											var schemaId=record.data.toSchemaId;
											var receiveType=record.data.receiveType;
											var str='';
											if(receiveFlag=='0'){
												if(sourceType!=null&&sourceType==2){
													str += '&nbsp;<button title="短信提醒" value=" " class="btn-add" onclick="ArchivesDepView.msgNotice('
														+'2,\''+ sourceUserName+'\',\''+subject+'\''+','+schemaId+','+receiveType
														+ ')"></button>短信提醒';
												}else{
													str += '&nbsp;<button title="短信提醒" value=" " class="btn-add" onclick="ArchivesDepView.msgNotice('
														+'1,'+ receiveDep+',\''+subject+'\''+','+schemaId+','+receiveType
														+ ')"></button>短信提醒';
												}
											}
											return str;
											}
											
						}
						],
				defaults : {
					sortable : true,
					menuDisabled : false,
					width : 100
				}
			});
		this.gridPanel=new Ext.grid.GridPanel({
				id : 'ArchivesDepGrid',
				region:'center',
				stripeRows:true,
				store : this.store,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				autoHeight : true,
				cm : cm,
				sm : sm,
				viewConfig : {
					forceFit : true,
					autoFill : true, //自动填充
					forceFit : true
					//showPreview : false
				},
				bbar : new Ext.PagingToolbar({
							pageSize : 25,
							store : this.store,
							displayInfo : true,
							displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
							emptyMsg : "当前没有记录"
				})
			});
		Ext.getCmp('ArchivesDepGrid').getStore().baseParams = {
			archivesId : archiveId
		}
	},//end of the initComponents()
	
	/**
	 * 
	 * @param {} self 当前窗体对象
	 */
	search:function(self){
		if(self.searchPanel.getForm().isValid()){//如果合法
			$search({
				searchPanel :self.searchPanel,
				gridPanel : self.gridPanel
			});
		}
	},
	reset : function(self) {
		self.searchPanel.getForm().reset();
	}

});


/**
 * 短信通知
 * 
 */
ArchivesDepView.msgNotice = function(sourceType,archDepId,subject,schemaId,receiveType) {
	new DownNoticeForm({
		sourceType :sourceType,
		archDepId : archDepId,
		subject: subject,
		schemaId : schemaId,
		receiveType : receiveType
	}).show();
};
/*查看反馈意见*/
ArchivesDepView.idear= function(id) {
	new FeedbackForm(id,2);
};

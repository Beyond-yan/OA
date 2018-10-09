/**
 * @author:Ropen
 * @Date:2014/02/19
 * @class ArchivesDepReceiveView
 * @extends Ext.Panel
 * @description 单位公文下载
 */
ArchivesDepReceiveView=Ext.extend(Ext.Panel,{
	//构造函数
	constructor:function(_cfg){
			if(_cfg==null){_cfg={};}
			Ext.apply(this,_cfg);
			//初始化组件
			this.initComponents();
			//调用父类构造
			ArchivesDepReceiveView.superclass.constructor.call(this,{
				id:'ArchivesDepReceiveView',
				title:'单位公文下载',
				iconCls : 'menu-planmanage',
				region:'center',
				layout:'border',
				items:[this.searchPanel,this.gridPanel]
			});
	},//end of constructor
	
	//初始化组件
	initComponents:function(){
		//初始化搜索条件Panel
		this.searchPanel=new Ext.FormPanel({
		    layout : 'form',
		    region:'north',
			bodyStyle: 'padding:6px 10px 6px 10px',
			height:88,
			border:false,
			defaults:{
				border:false,
				anchor:'98%,98%'
			},
		    items : [{
					   layout:'column',
	                   defaults:{border:false},
			            items:[	
					{
					columnWidth:.5,
					layout:'form',
					items:[{
						fieldLabel:'发文标题',
						name:'Q_subject_S_LK',
						xtype:'textfield'
					},{
						fieldLabel:'发文单位',
						name:'Q_sendDep_S_LK',
						xtype:'textfield'
					}]
				},
				{
					columnWidth:.5,
					layout:'form',
					items:[{
						fieldLabel:'接收状态',//0=未签收  1=已签收',
						hiddenName:'Q_receiveFlag_L_EQ',
						xtype:'combo',
						mode : 'local',
					   editable : false,
						triggerAction : 'all',
						store:[
						       ['0','未下载'],
						       ['1','已下载']
						       ]
					},{
						fieldLabel:'发送人',
						name:'Q_issuer_S_LK',
						xtype:'textfield',
						width:160
					},{
						name:'Q_sourceType_L_EQ',
						value:'1',
						hidden:true,
						xtype:'textfield',
						width:160
					}]
				}/*,{
				   	columnWidth:.33,
					layout:'form',
					items:[{
						fieldLabel:'签收日期',
						name:'Q_signTime_D_GE',
						xtype : 'datefield',
						format : 'Y-m-d',
						width:160
					},{
						fieldLabel:'分发日期',
						name:'Q_createTime_D_GE',
						xtype : 'datefield',
						format : 'Y-m-d',
						width:160
					}]
				}*/]},
				{
	            	xtype:'panel',
	            	border:false,
	            	layout:'hbox',
	            	layoutConfig:{
	            		pack:'center',
	            		align:'middle'
	            	},   
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
							url : __ctxPath+'/system/listDownloadSysDataTransfer.do',baseParams:{
								'Q_receiveFlag_L_EQ':0,
								'Q_sourceType_L_EQ':1
							},
							root : 'result',
							totalProperty : 'totalCounts',
							remoteSort : true,
							fields : [  'id', 'archivesId', 'archivesno', 'sendDep',
							'subject', 'archtype', 'issuerid', 'issuer',
							'privacylevel', 'urgentlevel', 'sources',
							'writtenDate', 'receiveDep', 'transferType',
							'fromSchema', 'toSchemaId', 'receiveDate',
							'receiveFlag', 'rejectMsg', 'createUser','dataSource',
							'createDate', 'transactionId', 'receiveUser','runid',
							'receiveUserName','receiveType']
		});
		this.store.setDefaultSort('createDate', 'desc');
		//加载数据
		this.store.load({params : {
					start : 0,
//					'Q_receiveFlag_L_EQ':0,
					limit : 25
		}});
		
		//初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'id',
						dataIndex : 'id',
						hidden : true
					} ,{
						header : 'archivesId',
						dataIndex : 'archivesId',
						hidden : true
					} ,{
						header : '公文标题',	
						dataIndex : 'subject',
						width : 130,
						renderer : function(value, metadata, record, rowIndex,colIndex){
							var archtype=record.data.archtype;
							var dataSource=record.data.dataSource;
							var runid=record.data.runid;
							var fromSchema=record.data.fromSchema;
							var str="";
							if(archtype==0)
						     str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchivesDepReceiveView.archiveDetail('+record.data.id+','+0+')">'+value+'</a>';
							else if(archtype==1||archtype==3)
							str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchivesDepReceiveView.archiveToReceive('+record.data.id+','+runid+','+dataSource+','+fromSchema+')">'+value+'</a>';
							return str;
						}
		               } ,{
						header : '发送人',	
						dataIndex : 'issuer'
						},{
						header : '发送单位',	
						dataIndex : 'sendDep'
						}, {
						header : '发送时间',
						width : 120,
						dataIndex : 'createDate'
					} ,{
						header : '接收时间',
						width : 120,
						dataIndex : 'receiveDate'
					},{
						header : '签收状态',//    0=未签收      1=已签收',	
						dataIndex : 'receiveFlag',
						renderer : function(value) {
									if (value == 0) {
											return "<span>未下载</span>";
										} else if(value == 1){
											return "<span>已下载</span>";
										}else{
											str="拒绝";
										}
									}
						},{header : '管理',
							width : 150,
							dataIndex : 'id',
							renderer : function(value, metadata, record, rowIndex,
										colIndex) {
											var id = value;
											var archtype=record.data.archtype;
											var dataSource=record.data.dataSource;
											var fromSchema=record.data.fromSchema;
											var str = '';
											if(archtype==0)
											str += '&nbsp;<button title="公文详情" value=" " class="btn-search" onclick="ArchivesDepReceiveView.archiveDetail('
															+ id
															+ ')"></button>公文详情';
											else if(archtype==1||archtype==3)
											str += '&nbsp;<button title="公文详情" value=" " class="btn-search" onclick="ArchivesDepReceiveView.archiveToReceive('+id+','+record.data.runid+','+dataSource+','+fromSchema+')"></button>公文详情';
											return str;
											}
											} ],
				defaults : {
					sortable : true,
					menuDisabled : false,
					width : 100
				}
			});
		this.topbar =  new Ext.Toolbar({
			id : 'ArchivesDepReceiveTopBar',
			height : 30,
			bodyStyle : 'text-align:left',
			items : []
		});
			this.topbar.add(new Ext.Button({
						iconCls : 'menu-flowPr',
						text : '标记为已收',
						handler : function() {
							var grid = Ext.getCmp("ArchivesDepReceiveGrid");
							var selectRecords = grid.getSelectionModel()
									.getSelections();
							if (selectRecords.length == 0) {
								Ext.ux.Toast.msg("信息", "请选择要标记为已收的记录！");
								return;
							}
							var ids = Array();
							for (var i = 0; i < selectRecords.length; i++) {
								ids.push(selectRecords[i].data.id);
							}
							ArchivesDepReceiveView.check(ids);
						}
					}));
		this.gridPanel=new Ext.grid.GridPanel({
				id : 'ArchivesDepReceiveGrid',
				tbar : this.topbar,
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

ArchivesDepReceiveView.archiveDetail= function(archivesId) {
	new ArchivesDetail({
		archivesId:archivesId,
		archType:1,
		freshId : 'ArchivesDepReceiveGrid',
		download : 0//0代表公文正文和附件下载后会变为已下载，1代表公文正文和附件下载后不会变为已下载
	}).show();
};
ArchivesDepReceiveView.archiveToReceive= function(archivesId,runid,dataSource,fromSchema) {
	    new ToReceiveArchivesDetailView({
		archivesId:archivesId,
		archType:1,
		freshId : 'ArchivesDepReceiveGrid',
		download : 0,//0代表公文正文和附件下载后会变为已下载，1代表公文正文和附件下载后不会变为已下载
		runid:runid,
		dataSource:dataSource,
		fromSchema:fromSchema
	}).show();
};
/**
 * 批量下载功能
 */
ArchivesDepReceiveView.check = function(id) {
 	var grid = Ext.getCmp("ArchivesDepReceiveGrid");
	Ext.Msg.confirm('信息确认', '您确认标记为已收吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath + '/system/checkSysDataTransfer.do',
				params : {
					ids : id
				},
				method : 'post',
				success : function() {
					Ext.ux.Toast.msg("操作信息", "成功标记所选记录！");
					grid.getStore().reload({
								params : {
									start : 0,
									limit : 25
								}
							});
				}
			});
		}
	});
};
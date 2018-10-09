/**
 * @author:hcy
 * @class OutMailSetView
 * @extends Ext.Panel
 * @description [OutMailSetView]管理
 * @company 广州宏天软件有限公司
 * @createtime:2010-11-1
 */
OutMailSetView=Ext.extend(Ext.Panel,{
	//条件搜索Panel
	searchPanel:null,
	//数据展示Panel
	gridPanel:null,
	//GridPanel的数据Store
	store:null,
	//头部工具栏
	topbar:null,
	//构造函数
	constructor:function(_cfg){
			Ext.applyIf(this,_cfg);
			//初始化组件
			this.initUIComponents();
			//调用父类构造
			OutMailSetView.superclass.constructor.call(this,{
				id:'OutMailSetView',
				title:'外部邮箱配置',
				iconCls : 'menu-mail_send',
				region:'center',
				layout:'border',
				items:[this.searchPanel,this.gridPanel]
			});
	},//end of constructor

	//初始化组件
	initUIComponents:function(){
		//初始化搜索条件Panel
		this.searchPanel=new Ext.FormPanel({
			id:'OutMailSetSearchForm',
		    region:'north',
		    height : 40,
			frame : false,
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
		    items : [{
				text : '查询条件:'
			},
			{
				text : '用户名称'
			},
			{
				width : 80,
				xtype : 'textfield',
				name : 'Q_userName_S_LK'
			},
			{
				text : 'smtp端口'
			},
			{
				width : 80,
				xtype : 'textfield',
				name : 'Q_smtpPort_S_LK'
			},
			{
				text : 'pop端口'
			},
			{
				width : 80,
				xtype :'textfield',
				name : 'Q_popPort_S_LK'
			},
		    {
				xtype : 'button',
				text : '查询',
				iconCls : 'search',
				handler : this.search.createCallback(this)
		    			
			}]
		});//end of the searchPanel
		
		
		//加载数据至store
		this.store = new Ext.data.JsonStore({
				url : __ctxPath + '/system/listOutMailSet.do',
				totalProperty : 'totalCounts',
				remoteSort : true,
				root : 'result',
				id : 'id',
				fields : [{
							name : 'id',
							type : 'int'
						},'userName','mailAddress','smtpHost',
						'smtpPort','popHost','popPort'
			  ]
		});
		
		this.store.setDefaultSort('id', 'desc');
		//加载数据
		this.store.load({params : {
					start : 0,
					limit : 25
		}});
		
		var actions = [];
		if(isGranted('_OutMailSetDelete')){
			actions.push({
								iconCls : 'btn-del',
								qtip : '删除',
								style : 'margin:0 3px 0 3px'
							})
		}
		if(isGranted('_OutMailSetEdit')){
			actions.push({
								iconCls : 'btn-mail_edit',
								qtip : '编辑',
								style : 'margin:0 3px 0 3px'
							})
		}
		this.rowActions = new Ext.ux.grid.RowActions({
					header : '管理',
					width : 80,
					actions : actions
				});		
		//初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'id',
						dataIndex : 'id',
						hidden : true
					},
					{ 
						header : '用户名称',
						dataIndex : 'userName'
					},
					{
						header : '外部邮件地址',
						dataIndex : 'mailAddress'
					},
					{
						header : 'smtp主机',
						dataIndex : 'smtpHost'
					},
					{
					    header : 'smtp端口',
					    dataIndex :　'smtpPort'
					},
					{
					    header : 'pop主机',
					    dataIndex :'popHost'
					},
					{
					    header : 'pop端口',
					    dataIndex :　'popPort'
					},this.rowActions],
				defaults : {
					sortable : true,
					menuDisabled : false,
					width : 100
			    }
		});
        //初始化工具栏
		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});
		if (isGranted('_OutMailSetAdd')) {
			this.topbar.add(new Ext.Button({
						text : '添加邮箱',
						iconCls : 'btn-add',
						handler:this.createRecord,
						scope : this
					}));
		}
		if (isGranted('_OutMailSetDelete')) {
			this.topbar.add(new Ext.Button({
						iconCls : 'btn-del',
						text : '删除邮箱',
						handler :this.delRecords,
		                scope : this	
					}));
		}// end of topbar
		
		this.gridPanel=new Ext.grid.GridPanel({
				id:'OutMailSetGrid',
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
				plugins : this.rowActions,
					viewConfig : {
						forceFit : true,
						autoFill : true, // 自动填充
						forceFit : true
				},
				bbar : new Ext.PagingToolbar({
							pageSize : 25,
							store : this.store,
							displayInfo : true,
							displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
							emptyMsg : "当前没有记录"
				})
			});
			this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
						new OutMailSetForm({id:rec.data.id}).show();
				});
			});		
			this.rowActions.on('action', this.onRowAction, this);
	},//end of the initComponents()
	
	/**
	 * 
	 * @param {} self 当前窗体对象
	 */
	search:function(self){
		var searchPanel=Ext.getCmp('OutMailSetSearchForm');
	       if(searchPanel.getForm().isValid()){//如果合法
	    	   var grid = Ext.getCmp('OutMailSetGrid');
	           var store=grid.getStore();
	           var baseParam=Ext.Ajax.serializeForm(searchPanel.getForm().getEl());
	           var deParams=Ext.urlDecode(baseParam);
	           deParams.start=0;
	           deParams.limit=store.baseParams.limit;
	           store.baseParams=deParams;
	           grid.getBottomToolbar().moveFirst();
	       }
	},
	/**
	 * 添加记录
	 */
	createRecord:function(){
		new OutMailSetForm().show();
	},
	/**
	 * 按IDS删除记录
	 * @param {} ids
	 */
	delByIds:function(ids){
		Ext.Msg.confirm('信息确认','您确认要删除所选记录吗？',function(btn){
			if(btn=='yes'){
				Ext.Ajax.request({
								url:__ctxPath+'/system/multiDelOutMailSet.do',
								params:{ids:ids},
								method:'POST',
								success:function(response,options){
									Ext.ux.Toast.msg('操作信息','成功删除该邮箱帐号！');
									Ext.getCmp('OutMailSetGrid').getStore().reload();
								},
								failure:function(response,options){
									Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
								}
							});
			}
		});//end of comfirm
	},
	
	/**
	 * 编辑记录
	 */
	editRecord:function(record){
	   new OutMailSetForm({id:record.data.id}).show();
	},
	/**
	 * 删除多条记录
	 */
	delRecords:function(){
		var gridPanel=Ext.getCmp('OutMailSetGrid');
		var selectRecords = gridPanel.getSelectionModel().getSelections();
		if (selectRecords.length == 0) {
			Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
			return;
		}
		var ids = Array();
		for (var i = 0; i < selectRecords.length; i++) {
			ids.push(selectRecords[i].data.id);
		}
		this.delByIds(ids);
	},
	/**
			 * 管理列中的事件处理
			 * 
			 * @param {}
			 *            grid
			 * @param {}
			 *            record
			 * @param {}
			 *            action
			 * @param {}
			 *            row
			 * @param {}
			 *            col
			 */
	onRowAction : function(gridPanel, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.delByIds(record.data.id);
						break;
					case 'btn-mail_edit' :
						this.editRecord(record);
						break;
					default :
						break;
				}
			}
});

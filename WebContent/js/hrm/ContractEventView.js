/**
 * @author:
 * @class ContractEventView
 * @extends Ext.Panel
 * @description [ContractEvent]管理
 * @company 广州宏天软件有限公司
 * @createtime:2010-01-16
 */
ContractEventView=Ext.extend(Ext.Panel,{
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
			ContractEventView.superclass.constructor.call(this,{
				id:'ContractEventView',
				title:'合同记录管理',
				region:'center',
				layout:'border',
				items:[this.searchPanel,this.gridPanel]
			});
	},//end of constructor

	//初始化组件
	initUIComponents:function(){
		//初始化搜索条件Panel
		this.searchPanel=new Ext.FormPanel({
			id:'ContractEventSearchForm',
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
		    	text :'请输入查询条件:'
		    },
		    {
		        text :'记录名称'
		    },
			{
				name:'Q_eventName_S_LK',
				xtype:'textfield'
					
			},
			{
			   text : '时间'
			},
			{
				name:'Q_createTime_S_LK',
				xtype : 'datefield',
				width : 110,
				format : 'Y-m-d',
				editable : false
					
			},
			{
			   text : '经手人'
			},
			{
				name:'Q_creator_S_LK',
				xtype:'textfield'
					
			},
		    {
				xtype : 'button',
				text : '查询',
				iconCls : 'search',
				handler : this.search.createCallback(this)
		    			
			}]
		});//end of the searchPanel
		
		this.rowActions = new Ext.ux.grid.RowActions({
			header:'管理',
			width:80,
			actions:[{
				 iconCls:'btn-del'
				,qtip:'删除'
				,style:'margin:0 3px 0 3px'
			}]
		});
		
		//加载数据至store
		this.store = new Ext.data.JsonStore({
							url : __ctxPath+"/hrm/listContractEvent.do",
							root : 'result',
							fields : [{name : 'eventId',type:'int'}
							,'userContract','eventName','eventDescp'
							,'createTime','creator'
					 ]
		});
		
		this.store.setDefaultSort('eventId', 'desc');
		//加载数据
		this.store.load({params : {
					start : 0,
					limit : 25
		}});
		//初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'eventId',
						dataIndex : 'eventId',
						hidden : true
					},
					{
						header : '记录名称',	
						dataIndex : 'eventName'
					},
					{
						header : '记录理由',	
						dataIndex : 'eventDescp'
					},
					{
						header : '创建时间',	
						dataIndex : 'createTime'
					},
					{
						header : '经手人',	
						dataIndex : 'creator'
					},this.rowActions],
				defaults : {
					sortable : true,
					menuDisabled : false,
					width : 100
				}
		});

		this.gridPanel=new Ext.grid.GridPanel({
				id:'ContractEventGrid',
				region:'center',
				stripeRows:true,
				store : this.store,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				autoHeight : true,
				cm : cm,
				sm : sm,
				plugins:this.rowActions,
				viewConfig : {
					forceFit : true,
					autoFill : true
				},
				bbar : new Ext.PagingToolbar({
							pageSize : 25,
							store : this.store,
							displayInfo : true,
							displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
							emptyMsg : "当前没有记录"
				})
			});
			this.rowActions.on('action', this.onRowAction, this);
	},//end of the initComponents()
	
	/**
	 * 
	 * @param {} self 当前窗体对象
	 */
	search:function(self){
		var searchPanel=Ext.getCmp('ContractEventSearchForm');
	       if(searchPanel.getForm().isValid()){//如果合法
	    	   var grid = Ext.getCmp('ContractEventGrid');
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
	 * 按IDS删除记录
	 * @param {} ids
	 */
	delByIds:function(ids){
		Ext.Msg.confirm('信息确认','您确认要删除所选记录吗？',function(btn){
			if(btn=='yes'){
				Ext.Ajax.request({
								url:__ctxPath+'/hrm/multiDelContractEvent.do',
								params:{ids:ids},
								method:'POST',
								success:function(response,options){
									Ext.ux.Toast.msg('操作信息','成功删除该合同事件！');
									Ext.getCmp('ContractEventGrid').getStore().reload();
								},
								failure:function(response,options){
									Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
								}
							});
			}
		});//end of comfirm
	},
	/**
	 * 删除多条记录
	 */
	delRecords:function(){
		var gridPanel=Ext.getCmp('ContractEventGrid');
		var selectRecords = gridPanel.getSelectionModel().getSelections();
		if (selectRecords.length == 0) {
			Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
			return;
		}
		var ids = Array();
		for (var i = 0; i < selectRecords.length; i++) {
			ids.push(selectRecords[i].data.eventId);
		}
		this.delByIds(ids);
	},
	
	/**
	 * 管理列中的事件处理
	 * @param {} grid
	 * @param {} record
	 * @param {} action
	 * @param {} row
	 * @param {} col
	 */
	onRowAction:function(gridPanel, record, action, row, col) {
		switch(action) {
			case 'btn-del':
				this.delByIds(record.data.eventId);
				break;
			default:
				break;
		}
	}
});

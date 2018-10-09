/**
 * @author:
 * @class UserContractView
 * @extends Ext.Panel
 * @description [UserContract]管理
 * @company 广州宏天软件有限公司
 * @createtime:2010-01-16
 */
UserContractView=Ext.extend(Ext.Panel,{
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
			UserContractView.superclass.constructor.call(this,{
				id:'UserContractView',
				title:'合同管理',
				iconCls:'menu-contract',
				region:'center',
				layout:'border',
				items:[this.searchPanel,this.gridPanel]
			});
	},//end of constructor

	//初始化组件
	initUIComponents:function(){
		//初始化搜索条件Panel
		this.searchPanel=new Ext.FormPanel({
			id:'UserContractSearchForm',
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
   				text : '请输入查询条件:'		    	
		    },
			{
				text : '合同编号'
			},
			{
				width : 100,
				name : 'Q_contractNo_S_LK',
				xtype:'textfield'
				
			},
			{
				text : '签约人'
			},
			{
				width : 100,　　　　　　　　　　　　　　　　　　　　　　　　　　　
				name:'Q_fullname_S_LK',
				xtype:'textfield'
				
			},
			{
				text : '合同状态'
			},
			{
				width : 80,
				name:'Q_status_S_LK',
				xtype:'textfield',
				xtype : 'combo',
				editable : false,
				mode : 'local',
				triggerAction : 'all',
				store : [['0','草稿'],['1','有效'],['2','终止']]
					
			},
			{
			    text : '签约日期'	
			},
			{
				name:'Q_signDate_S_LK',
				xtype : 'datefield',
				width : 110,
				format : 'Y-m-d',
				editable : false
					
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
							url : __ctxPath+"/hrm/listUserContract.do",
							root : 'result',
							totalProperty : 'totalCounts',
							remoteSort : true,
							fields : [{name : 'contractId',type:'int'}
							,'contractNo','userId','fullname','status'
							,'timeLimit','isCompeted','isSecret','breakBurden'
							,'otherItems','contractType','signDate','startDate'
							,'expireDate'
						]
		});
		this.store.setDefaultSort('contractId', 'desc');
		//加载数据
		this.store.load({params : {
					start : 0,
					limit : 25
		}});
		
		this.rowActions = new Ext.ux.grid.RowActions({
			header:'管理',
			width:180,
			actions:[{
				 iconCls:'btn-del'
				,qtip:'删除'
				,style:'margin:0 3px 0 3px'
			},
			{
				 iconCls:'btn-edit'
				,qtip:'合同变更'
				,style:'margin:0 3px 0 3px'
			},
			{
				 iconCls:'btn-carapply-del'
				,qtip:'合同终止'
				,style:'margin:0 3px 0 3px'
			},
			{
			    iconCls:'menu-arch-undertake'
			    ,qtip:'合同续约'
			    ,style:'margin:0 3px 0 3px'
			},
			{
			   iconCls:'menu-list'
			   ,qtip:'查看合同'
			   ,style:'margin:0 3px 0 3px'
			}
			]
		});
		
		//初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'contractId',
						dataIndex : 'contractId',
						hidden : true
					},
					{
						header : '合同编号',	
						dataIndex : 'contractNo'
					},
					{
						header : '签约职员ID',	
						dataIndex : 'userId',
	                    hidden : true
					},
					{
						header : '签约人',	
						dataIndex : 'fullname'
					},
					{
						header : '合同状态',	
						dataIndex : 'status',
						renderer:function(value, metadata, record, rowIndex,
								colIndex){
				       var startTime = new Date(getDateFromFormat(value, "yyyy-MM-dd"));
				       var expireDate = new Date(getDateFromFormat(record.data.expireDate, "yyyy-MM-dd")); 
				       var today = new Date();
						   if(value =='0'){
						       return '草稿'
						   }else if(value =='1'){
						      return '<img title="有效" src="'
										+ __ctxPath
										+ '/images/flag/customer/effective.png"/>';
						   }else if(today>=expireDate&&value=='2'){
						      return '<img title="终止" src="'
										+ __ctxPath
										+ '/images/flag/customer/invalid.png"/>';
						   }
						}
					},
					{
						header : '期限形式',	
						dataIndex : 'timeLimit'
					},
					{
						header : '竞业条款',	
						dataIndex : 'isCompeted',
						renderer : function(value){
						   if(value =='0'){
						      return '无'
						   }else{
						      return '有';
						   }
			
						}
					},
					{
						header : '保密协议',	
						dataIndex : 'isSecret',
						renderer : function(value){
						   if(value =='0'){
						      return '无'
						   }else{
						      return '有';
						   }
			
						}
					},
					{
						header : '合同类型',	
						dataIndex : 'contractType'
					},
					{
						width:180,
						header : '签约日期',	
						dataIndex : 'signDate'
					}, this.rowActions],
				defaults : {
					sortable : true,
					menuDisabled : false,
					width : 100
				}
			});
		//初始化工具栏
		this.topbar=new Ext.Toolbar({
				height : 30,
				bodyStyle : 'text-align:left',
				items : [{
							iconCls : 'btn-add',
							text : '添加合同',
							xtype : 'button',
							handler:this.createRecord
						}, {
							iconCls : 'btn-del',
							text : '删除合同',
							xtype : 'button',
							handler :this.delRecords,
							scope: this
						}]
			});
			
		this.gridPanel=new Ext.grid.GridPanel({
				id : 'UserContractGrid',
				region:'center',
				stripeRows:true,
				tbar : this.topbar,
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

			this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
						new UserContractForm({contractId:rec.data.contractId}).show();
				});
			});		
			this.rowActions.on('action', this.onRowAction, this);
	},//end of the initComponents()
	
	/**
	 * 
	 * @param {} self 当前窗体对象
	 */
	search:function(self){
		var searchPanel=Ext.getCmp('UserContractSearchForm');
	       if(searchPanel.getForm().isValid()){//如果合法
	    	   var grid = Ext.getCmp('UserContractGrid');
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
		new UserContractForm().show();
	},
	/**
	 * 合同变更
	 * */
	endContract:function(record){
		var status = record.data.status;
		if(status ==2){
		  return new EndContractForm().show();
		}else{
		  alert("此合同是草稿或是有效，只能变更或续约合同内容!")
		}
	},
	/**
	 * 合同续约
	 * */
	continueContract:function(record){
		var status = record.data.status;
		if(status != 0){
		  return new ContinueContractForm().show();
		}else{
		  alert("此人签订的合同还没生效，无法进行合同续约!");
		}
	},
	/**
	 * 查看合同
	 * */
	LookContract:function(record){
		new UserContractDetailWin({contractId:record.data.contractId}).show();
	},
	/**
	 * 按IDS删除记录
	 * @param {} ids
	 */
	delByIds:function(ids){
		Ext.Msg.confirm('信息确认','您确认要删除所选记录下及所附属的合同附件和合同记录吗？',function(btn){
			if(btn=='yes'){
				Ext.Ajax.request({
								url:__ctxPath+'/hrm/multiDelUserContract.do',
								params:{ids:ids},
								method:'POST',
								success:function(response,options){
									Ext.ux.Toast.msg('操作信息','成功删除该合同！');
									Ext.getCmp('UserContractGrid').getStore().reload();
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
		var gridPanel=Ext.getCmp('UserContractGrid');
		var selectRecords = gridPanel.getSelectionModel().getSelections();
		if (selectRecords.length == 0) {
			Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
			return;
		}
		var ids = Array();
		for (var i = 0; i < selectRecords.length; i++) {
			ids.push(selectRecords[i].data.contractId);
		}
		this.delByIds(ids);
	},
	
	/**
	 * 编辑记录
	 * @param {} record
	 */
	editRecord:function(record){
		 var status = record.data.status;
		 if(status == 0){
		    return  new UserContractForm({contractId:record.data.contractId}).show();
		 }else{
		    alert("此合同不是草稿！");
		 }
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
				this.delByIds(record.data.contractId);
				break;
			case 'btn-edit':
				this.editRecord(record);
				break;
			case 'btn-carapply-del':
				this.endContract(record);
				break;
			case 'menu-arch-undertake':
				this.continueContract(record);
				break;
			case 'menu-list':
			    this.LookContract(record);
			    break;
			default:
				break;
		}
	}
});

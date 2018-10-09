/**
 * 
 * @class UserSubWindow
 * @extends Ext.Windows
 */
UserSubWindow=Ext.extend(Ext.Window,{
	constructor:function(conf){
		Ext.apply(this,conf);
		this.initUICmps();
		UserSubWindow.superclass.constructor.call(this,{
			title:'用户'+conf.username+'下属信息',
			modal:true,
			iconCls:'menu-subuser',
			maximizable : true,
			buttonAlign:'center',
			width:680,
			height:400,
			layout:'border',
			items:[
				this.searchPanel,
			    this.southPanel,
			    this.rightPanel
			],
			buttons:[
			{
				text:'保存',
				iconCls:'btn-save',
				scope:this,
				handler:this.save
			},{
				text:'取消',
				iconCls:'btn-cancel',
				scope:this,
				handler:function(){
					this.close();
				}
			}]
		});
	},
	save:function(){
		var win=this;
		var rightGrid=Ext.getCmp('rightPanel');
		var userId = this.userId;
		var store=rightGrid.getStore();
		var rows = store.getCount();
		var subUserIds='';
		for(var i=0;i<rows;i++){
			if(i>0){
				subUserIds+=',';
			}
			subUserIds+=store.getAt(i).data.userId;
		}
		$request({
			url:__ctxPath+'/system/addMyUserSub.do',
			params:{
				userId:userId,
				subUserIds:subUserIds
			},
			success:function(response,options){
				Ext.ux.Toast.msg('操作信息','成功保存信息');
				win.close();
			}
		});
	},
	search:function(){
		var searchPanel=this.searchPanel;
		var gridPanel=Ext.getCmp('leftPanel');
		var store=gridPanel.getStore();
		var baseParam=Ext.Ajax.serializeForm(searchPanel.getForm().getEl());
		var deParams=Ext.urlDecode(baseParam);
		deParams.start=0;
		deParams.limit=store.baseParams.limit;
		deParams.userId=this.userId;
		store.baseParams=deParams;
		gridPanel.getBottomToolbar().moveFirst();
	},

	addAll:function(){
		
		var leftGrid=Ext.getCmp('leftPanel');
		var rightGrid=Ext.getCmp('rightPanel');
		var rightStore=rightGrid.getStore();
		
		var rows = leftGrid.getSelectionModel().getSelections();
		for(var i=0;i<rows.length;i++){
			
			var userId = rows[i].data.userId;
			var isExist=false;
			//查找是否存在该记录
			for(var j=0;j<rightStore.getCount();j++){
				if(rightStore.getAt(j).data.userId==userId){
					isExist=true;
					break;
				}
			}
			if(!isExist){
				var newRecord=new rightStore.recordType(rows[i].data);
				rightGrid.stopEditing();
				rightStore.add(newRecord);
			}
		}
		
		for(var j=rows.length-1;j>=0;j--){
				leftGrid.stopEditing();
				leftGrid.getStore().remove(rows[j]);
		}
	
		
	},
	
	removeAll:function(){
		
		var leftGrid = Ext.getCmp('leftPanel');
		var leftStore=leftGrid.getStore();
		var rightGrid=Ext.getCmp('rightPanel');
		var rightStore=rightGrid.getStore();
		var rows = rightGrid.getSelectionModel().getSelections();
		
		for(var i=0;i<rows.length;i++){
			var userId = rows[i].data.userId;
			var isExist=false;
			//查找是否存在该记录
			for(var j=0;j<leftStore.getCount();j++){
				if(leftStore.getAt(j).data.userId==userId){
					isExist=true;
					break;
				}
			}
			if(!isExist){
				var newRecord=new leftStore.recordType(rows[i].data);
				leftGrid.stopEditing();
				leftStore.add(newRecord);
			}
		}
		
		for(var j=rows.length-1;j>=0;j--){
		rightGrid.stopEditing();
		rightStore.remove(rows[j]);
		}
		
	},
								

	
	initUICmps:function(){
		this.searchPanel=new Ext.FormPanel(
			{
				height:38,
				region:'north',
				layout:'hbox',
				bodyStyle:'padding:6px 2px 2px 2px',
				layoutConfigs:{
					align:'middle'
				},
				defaultType:'label',
				defaults:{
					margins:'0 4 0 4'
				},
				items:[
						{
						text : '请输入查询条件:名字'
					}, {
						xtype : 'textfield',
						name : 'Q_fullname_S_LK'
					},
					{
						xtype:'button',
						text:'查询',
						iconCls:'btn-search',
						scope:this,
						handler:this.search
					}
				]
		}
	);//end search panel
	
		var store=new Ext.data.JsonStore({
							url : __ctxPath + "/system/myUserSub.do",
							root : 'result',
							totalProperty : 'totalCounts',
							baseParams:{
								userId:this.userId
							},
							remoteSort : true,
							fields : [{name:'userId',type:'int'}
							,'fullname','title']
		});
		store.load();
		
		var sm= new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), 
			{
				header : '姓名',
				dataIndex : 'fullname',
				renderer:function(value,metadata,rs){
					var title=rs.data.title;
				    if(title==1){
						return '<img src="'+__ctxPath+'/images/flag/man.png"/>&nbsp;'+value;
					}else{
						return '<img src="'+__ctxPath+'/images/flag/women.png"/>&nbsp;'+value;
					}
				}
			}]
		});
		
		var leftStore=new Ext.data.JsonStore({
							url : __ctxPath + "/system/listAppUser.do",
							root : 'result',
							totalProperty : 'totalCounts',
							baseParams:{
								userId:this.userId,
								start : 0,
								limit : 25
							},
							remoteSort : true,
							fields : [{
											name : 'userId',
											type : 'int'
									   }, 
										'fullname',
										'title']
		});
		leftStore.load();
		var csm = new Ext.grid.CheckboxSelectionModel();		
		var leftPanel = new Ext.grid.EditorGridPanel({
			id : 'leftPanel',
			region:'center',
			title:'可选用户列表',
			height : 370,
			width:400,
			autoWidth:false,
			store : leftStore,
			shim : true,
			trackMouseOver : true,
			disableSelection : false,
			loadMask : true,
			cm : cm,
			sm : sm,
			viewConfig : {
				forceFit : true,
				enableRowBody : false,
				showPreview : false
			},
			bbar : new Ext.PagingToolbar({
						pageSize : 25,
						store : leftStore,
						displayInfo : true,
						displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
						emptyMsg : "当前没有记录"
			})
		});
		this.rightPanel= new Ext.grid.EditorGridPanel({
					title:'我的下属',
					autoScroll:true,
					id : 'rightPanel',
					region : 'east',
					height : 400,
					width:220,
					autoScroll:true,
					store :store,
					trackMouseOver : true,
					sm:csm,
					columns : [sm, new Ext.grid.RowNumberer(), {
						header : "用户名",
						dataIndex : 'fullname',
						width:200,
						renderer:function(value,meta,record){
							var title=record.data.title;
							if(title==1){
								return '<img src="'+__ctxPath+'/images/flag/man.png"/>&nbsp;'+value;
							}else{
								return '<img src="'+__ctxPath+'/images/flag/women.png"/>&nbsp;'+value;
							}
						}
					}]
		});
						
		
		this.southPanel=new Ext.Panel({
			width:50,
			region:'center',
			layout:'border',
			border:false,
			items:[
					new Ext.Panel({
						width:35,
						height:430,
						region:'east',
						layout: {
	                                type:'vbox',
	                                pack:'center',
	                                align:'stretch'
	                            },
	                    defaults:{margins:'0 0 5 0'},
						items:[
								{
									xtype:'button',
									iconCls:'add-all',
									text:'',
									scope:this,
									handler:this.addAll
								},
								{
									xtype:'button',
									text:'',
									iconCls:'rem-all',
									handler:this.removeAll
								}
						]
					}),leftPanel
				]
		});
	}
}); 
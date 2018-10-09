Ext.ns('MyTaskView');
/**
 * 我的任务流程 
 */
MyTaskView = Ext.extend(Ext.Panel, {
	// 条件搜索Panel
	searchPanel:null,
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
		MyTaskView.superclass.constructor.call(this, {
					id : 'MyTaskView',
					iconCls : 'menu-flowWait',
					title : '我的待办事项',
					region : 'center',
					layout : 'border',
					items : [this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		var combomealtype = new Ext.form.ComboBox({
			fieldLabel : '流程名称',
			hiddenName : 'proTypeId',
			flex : 1,
			width : 150,
			xtype : 'combo',
			editable : false,
			triggerAction : 'all',
			displayField : 'name',
			valueField : 'defId',
			mode : 'local',
			store : new Ext.data.SimpleStore(
					{
						autoLoad : true,
						url : __ctxPath + '/flow/comProDefinition.do',
						fields : [ 'defId','name' ]
						           }
					   )		
		});
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
			id : 'MyTaskViewSearchForm',
			height : 80,
			region : 'north',
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
				xtype:'fieldset',
				layout:'column',
				title:'开始时间排序',
				defaultType:'radio',
				//autoHeight:true,
				hideLabels:true,
				width:120,
				items:[
				       {boxLabel:'升序',name:'createDateSort',inputValue:'date_asc',	columnWidth:.5},
				       {boxLabel:'降序',name:'createDateSort',inputValue:'date_desc',	columnWidth:.5,checked:true}
				       ]
			},{
				xtype:'fieldset',
				layout:'column',
				title:'紧急程度排序',
				defaultType:'radio',
				autoHeight:true,
				hideLabels:true,
				width:120,
				items:[
				       {boxLabel:'升序',name:'urgentSort',inputValue:'urgent_asc',	columnWidth:.5,checked:true},
				       {boxLabel:'降序',name:'urgentSort',inputValue:'urgent_desc',	columnWidth:.5}
				       ]
			} ,{
				xtype : 'button',
				text : '查询',
				iconCls : 'search',
				handler : function() {
					var searchPanel = Ext.getCmp('MyTaskViewSearchForm');
					var gridPanel = Ext.getCmp('MyTaskGrid');
					if (searchPanel.getForm().isValid()) {
						$search({
							searchPanel :searchPanel,
							gridPanel : gridPanel
						});
					}

				}
			}]
		});// end of the searchPanel
		
		// 加载数据至store
		this.store = new Ext.data.Store({  
	        proxy: new Ext.data.HttpProxy({  
	            url: __ctxPath+'/flow/listTask.do'
	        }),  
	        // create reader that reads the Topic records  
	        reader: new Ext.data.JsonReader({
	            root: 'result',  
	            totalProperty: 'totalCounts',  
	            fields: [
	            	'taskName',
		            'activityName',
		            'assignee',
		            'creatorName',
		            'depName',
		            'createTime',
		            'dueDate',
		            'executionId',
		            'pdId',
		            'taskId','isMultipleTask','type','link','urgentLevel','daiBanInfo'
		            ]  
	        })
	    });  
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});

		// 初始化ColumnModel
		var cm = new Ext.grid.ColumnModel({
			 columns:[new Ext.grid.RowNumberer(),{
		          header: "userId",
		          dataIndex: 'userId',
		          width: 20,
		          hidden: true,
		          sortable: true
		      },{
		          header:'事项名称',
			      dataIndex:'taskName',
			      width:100,
			      renderer:function(value,metadata,record,rowIndex,colIndex){
			      		var taskId=record.data.taskId;
			      		var exeId=record.data.executionId;
			      		var assignee=record.data.assignee;
			      		var activityName=record.data.activityName;
			      		var isMultipleTask=record.data.isMultipleTask;
			      		var type = record.data.type;
			      		var link = record.data.link;
			      		var taskName = record.data.taskName.replace(/\"/g,'”');	      		
			      		var str='';
			      		if(type==0){
			      			if(assignee==''){
				      			str+='<button title="锁定任务" class="btn-lockTask" onclick="MyTaskView.lockTask('+taskId+')"></button>';
				      		}else{
				      			str+='<a href="#"   onclick="MyTaskView.nextStep(\''+taskId+'\',\''+activityName+'\',\''+ taskName +'\')">'+value+'</a>';
				      			
	                            //	str+='&nbsp;<a  href="#"   onclick="MyTaskView.changeTask('+taskId+',\''+activityName+'\')">任务代办</a>';
				      			
				      			if(isMultipleTask==1){//多人的任务，自己可以解锁由其他人来执行
				      				str+='&nbsp;<button title="解锁任务" class="btn-unlockTask" onclick="MyTaskView.unlockTask('+taskId+')"></button>';
				      			}
				      		}
			      		}else{
			      			str+='<a href="#" onclick="javascript:App.clickTopTab(\''+ link +'\')">审核</a>';
			      		}
			      		
			      		return str;
			      	}
		      }/*,{
		          header:'执行人',
			      dataIndex:'assignee',
			      width:60,
			      renderer:function(value,metadata,record,rowIndex,colIndex){
			      	var assignee=record.data.assignee;
			      	if(assignee==null || assignee==''){
			      		return '<font color="red">暂无执行人</font>';
			      	}else{
			      		return assignee;
			      	}
			      }
		      },*/,
		      	{
		      	  header:'发起人',
		      	  dataIndex:'creatorName',
		      	  width:60,
		      	  sortable:true
		      },
		      	{
		      	  header:'发起部门',
		      	  dataIndex:'depName',
		      	  width:60,
		      	  sortable:true
		      },{
		      	  header:'发起时间',
		      	  dataIndex:'createTime',
		      	  width:60,
		      	  sortable:true
		      },/*{
		      	   header:'到期时间',
		      	   dataIndex:'dueDate',
		      	   width:60,
		      	   renderer:function(value){
		      	   	if(value==''){
		      	   		return '无限制';
		      	   	}else{
		      	   		return value;
		      	   	}
		      	   }
		      },*/{
		          header:'紧急程度',
			      dataIndex:'urgentLevel',
			      width:60
		      },{
		          header:'任务类型',
			      dataIndex:'daiBanInfo',
			      width:60
		      },
		      	{
			      	hidden:true,
			      	dataIndex:'executionId'
		      },{
			      	hidden:true,
			      	dataIndex:'taskId'
		      },{
		      		hidden:'true',
		      		dataIndex:'isMultipleTask'
		      },{
		      	header:'管理',
		      	dataIndex:'taskdbid',
		      	width:50,
		      	renderer:function(value,metadata,record,rowIndex,colIndex){
		      		var taskId=record.data.taskId;
		      		var exeId=record.data.executionId;
		      		var assignee=record.data.assignee;
		      		var activityName=record.data.activityName;
		      		var isMultipleTask=record.data.isMultipleTask;
		      		var type = record.data.type;
		      		var link = record.data.link;
		      		var taskName = record.data.taskName.replace(/\"/g,'”');	      		
		      		var str='';
		      		if(type==0){
		      			if(assignee==''){
			      			str+='<button title="锁定任务" class="btn-lockTask" onclick="MyTaskView.lockTask('+taskId+')"></button>';
			      		}else{
			      			str+='<a href="#"   onclick="MyTaskView.nextStep(\''+taskId+'\',\''+activityName+'\',\''+ taskName +'\')">处理任务</a>';
			      			
                            str+='&nbsp;<a  href="#"   onclick="MyTaskView.changeTask('+taskId+',\''+activityName+'\')">任务代办</a>';
			      			
			      			if(isMultipleTask==1){//多人的任务，自己可以解锁由其他人来执行
			      				str+='&nbsp;<button title="解锁任务" class="btn-unlockTask" onclick="MyTaskView.unlockTask('+taskId+')"></button>';
			      			}
			      		}
		      		}else{
		      			str+='<a href="#" onclick="javascript:App.clickTopTab(\''+ link +'\')">审核</a>';
		      		}
		      		
		      		return str;
		      	}
		      }
	      	],
		    defaults: {
		        sortable: true,
		        //menuDisabled: true,
		        width: 100
		    }
		});
		// 初始化工具栏
		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : [
					// {
					// iconCls : 'btn-archives-remind',
					// text : '催办',
					// xtype : 'button'
					// }
					]
				});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'MyTaskGrid',
					region : 'center',
					stripeRows : true,
					tbar : this.topbar,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					viewConfig : {
						forceFit : true,
						autoFill : true, // 自动填充
						forceFit : true
						// showPreview : false
					},
					bbar : new HT.PagingBar({
								store : this.store
							}),
					tbar : new Ext.Toolbar({
							height : 28,
							items : [{
										text : '刷新',
										iconCls : 'btn-refresh',
										handler : function() {
											Ext.getCmp('MyTaskGrid').getStore().reload();
										}
									}]
					})
				});

	}

});
/**
 * 锁定任务，则表示申请执行该任务
 * @param {} taskdbid
 */
MyTaskView.lockTask=function(taskId){
	Ext.Ajax.request({
		url:__ctxPath+'/flow/lockTask.do',
		params:{
			taskId:taskId
		},
		method:'post',
		success:function(result,response){
			var grid=Ext.getCmp("MyTaskGrid");
			var resultObj=Ext.util.JSON.decode(result.responseText)
			if(resultObj.hasAssigned==true){
				Ext.ux.Toast.msg("操作提示","该任务已经被其他用户锁定执行！");
			}else{
				Ext.ux.Toast.msg("操作提示","该任务已经成功锁定，请执行下一步操作！");
			}
			grid.getStore().reload();
		}
	});
};

/**
 * 任务变更，则转由代办人来处理
 * @param {} taskId
 */
MyTaskView.changeTask=function(taskId,taskname){
	new ChangeTaskView(taskId,taskname);
};

/**
 * 锁定任务，则表示自己退出执行该任务，其他人员可以申请执行该任务 
 * @param {} taskdbid
 */
MyTaskView.unlockTask=function(taskId){
	Ext.Ajax.request({
		url:__ctxPath+'/flow/unlockTask.do',
		params:{
			taskId:taskId
		},
		method:'post',
		success:function(result,response){
			var grid=Ext.getCmp("MyTaskGrid");
			var resultObj=Ext.util.JSON.decode(result.responseText)
			
			if(resultObj.unlocked==true){
				Ext.ux.Toast.msg("操作提示","该任务已经成功解锁！");
			}else{
				Ext.ux.Toast.msg("操作提示","该任务解锁失败(任务已经由其他人员执行完成)！");
			}
			grid.getStore().reload();
		}
	});
};
/**
 * 下一步的任务
 * @param {} taskdbid
 */
MyTaskView.nextStep=function(taskId,activityName,taskName){
	var contentPanel=App.getContentPanel();
	//alert(contentPanel.getItem(0).title)
	if(taskName.indexOf('--')>=0){
		taskName = taskName.substring(0,taskName.indexOf('--'));
	}
	for(var i=0;i<contentPanel.items.length;i++){
		if(contentPanel.getItem(i).title == taskName){
			var formView=contentPanel.getItem(i);
			contentPanel.activate(formView);
			Ext.ux.Toast.msg("操作提示","请先处理上一个同类型的任务！");
			return;
		}
	}
	var formView=contentPanel.getItem('ProcessNextForm'+taskId);
	if(formView==null){
		formView=new ProcessNextForm({taskId:taskId,activityName:activityName, taskName:taskName});
		contentPanel.add(formView);
	}
	contentPanel.activate(formView);
};
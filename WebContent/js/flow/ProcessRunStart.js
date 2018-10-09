ProcessRunStart=Ext.extend(Ext.Panel,{
	/**
	 * 内部的任务表单
	 * @type 
	 */
	formPanel:new Ext.form.FormPanel(),
	
	constructor:function(config){
		
		Ext.applyIf(this,config);
		
		this.buttonsArr=[
				{
					text:'提交并启动流程',                                                                   
					iconCls : 'btn-ok',
					scope:this,
					handler:this.saveAndStart
				},
				{
					text:'重置表单',
					scope:this,
					iconCls:'btn-reset',
					handler:this.reset
				},'-',{
					text:'流程示意图',
					scope:this,
					iconCls:'btn-flow-chart',
					handler:function(){
						new ProcessImageWindow({defId:config.defId}).show();
					}
				}
			];
		
		ProcessRunStart.superclass.constructor.call(this,{
			autoScroll:true,
			layout:'border',
			tbar:new Ext.Toolbar({height:26,items:this.buttonsArr}),
			layoutConfig: {
                            padding:'5',
                            pack:'center',
                            align:'middle'
            },
            defaults:{
            	margins:'0 5 10 0'
            },                
			title:'流程启动-' + this.flowName,
			iconCls:'btn-flow-start',
			items : []
		});
	},
	
	/**
	 * 保存并启动流程
	 */
	saveAndStart:function(){
		var topPanel=this;
		var formPanel=topPanel.formPanel;

		if(formPanel.save){
			result=formPanel.save.call(formPanel);
			if(!result) return;
		}

		if(formPanel.getForm().isValid()){
			formPanel.getForm().submit({
						url : __ctxPath + '/flow/saveProcessActivity.do',
						waitMsg : '正在提交流程表单信息...',
						params:{
							defId:this.defId,
							runId:this.runId,
							activityName:this.activityName,
							//启动工作流
							startFlow:true
						},
						success : function(userform, o) {
							Ext.ux.Toast.msg('操作信息','成功保存信息！');
							AppUtil.removeTab(topPanel.getId());
							var runGrid=Ext.getCmp('ProcessRunGrid');
							if(runGrid!=null){
								runGrid.getStore().reload();
							}
						}
			});
		}
	},
	
	reset:function(){
		this.formPanel.getForm().reset();
	},
	initComponent:function(){
	var msgPanel=new Ext.Panel({
		style : 'padding:0px 0px 0px 0px;margin-left:6px;',
		border:false,
		autoHeight:true,
		layout:'column',
		items:[{
				xtype : 'label',
				style : 'padding:0px 0px 0px 0px;',
				text : '提醒办理人：',
				width : 80
			},{
				xtype:'checkbox',
				name:'sendMail',
				//style : 'margin-left:25px;',
				inputValue:'true',
				boxLabel:'发送邮件',
				columnWidth:.16,
				listeners : {
					'check' : function(checkbox, checked){
						if(checked){//只有在点击时触发
							msgPanel.getCmpByName('sendMail').setValue(true);
							msgPanel.getCmpByName('sendMsg').setValue(false);
							msgPanel.getCmpByName('sendInfo').setValue(false);
						}   
					}
				}
			},{
				xtype:'checkbox',
				name:'sendMsg',
				inputValue:'true',
				boxLabel:'发送短信',
				columnWidth:.16,
				listeners : {
					'check' : function(checkbox, checked){
						if(checked){//只有在点击时触发
							msgPanel.getCmpByName('sendMail').setValue(false);
							msgPanel.getCmpByName('sendMsg').setValue(true);
							msgPanel.getCmpByName('sendInfo').setValue(false);
						}   
					}
				}
			},{
				xtype:'checkbox',
				name:'sendInfo',
				inputValue:'true',
				boxLabel:'即时消息',
				columnWidth:.16,
				listeners : {
					'check' : function(checkbox, checked){
						if(checked){//只有在点击时触发
							msgPanel.getCmpByName('sendMail').setValue(false);
							msgPanel.getCmpByName('sendMsg').setValue(false);
							msgPanel.getCmpByName('sendInfo').setValue(true);
						}   
					}
				}
			}//end of fieldset
		]//end of panel items
	});
		
	var ccPanel=new Ext.Panel({
			style : 'padding:10px 0px 0px 0px;margin-left:6px;',
			border:false,
			autoHeight:true,
			layout:'column',
			items : [{
						xtype : 'label',
						style : 'padding:0px 0px 0px 0px;',
						text : '阅知:',
						width : 105
					}, {
						// columnWidth:.6,
						xtype : 'textfield',
						name : 'ccNames',
						width : '70%',
						readOnly : true
					}, {
						xtype : 'hidden',
						name : 'ccIds'
					}, {
						xtype : 'button',
						iconCls : 'menu-department',
						text : '选择阅知人',
						handler : function() {
							var issuerId = ccPanel.getCmpByName('ccIds').getValue();
							var reporterName = ccPanel.getCmpByName('ccNames').getValue();
							var array1=[];
							var array2=[];									
							var m = new Map();
							if(issuerId!=null && issuerId!=''){
									array1 = issuerId.split(',');
									array2 = reporterName.split(',');
									for(var i=0;i<array1.length;i++){	
										m.put(array1[i],array2[i]);
									}
							}
							DeptOfUserSelector.getView(
									function(userIds, fullnames) {
										ccPanel.getCmpByName('ccIds').setValue(userIds);
										ccPanel.getCmpByName('ccNames').setValue(fullnames);
									}, false, false, curUserInfo.depId, m)
							.show();
						}
					},{
						id: 'SearchSubject',
						xtype : 'hidden'
					},{
						id: 'SearchFileNames',
						xtype : 'hidden'
					},{
						id: 'SearchDocNames',
						xtype : 'hidden'
					}]
		});
		var searchStore = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
				url : __ctxPath + '/archive/oaSearchListArchives.do'
			}),
			reader : new Ext.data.JsonReader({
						root : 'result',
						totalProperty : 'totalCounts',
						fields : [{
							name : 'archivesId',
							type : 'int'
						}, 'subject','createtime','isdraft','isreceive','keywords']
					}),
			remoteSort : true
		});
		searchStore.setDefaultSort('createtime', 'desc');
		var cm = new Ext.grid.ColumnModel({
		columns : [new Ext.grid.RowNumberer(), {
					header : 'archivesId',
					dataIndex : 'archivesId',
					hidden : true
				},{
					header : '标题',
					dataIndex : 'subject',
					width : 70,
					renderer : function(value, metadata, record, rowIndex,colIndex) {
						var datatype=record.data.keywords;
						if(datatype=="") datatype="0";
						metadata.attr = 'style="white-space:normal;"';
						var str = '<a href="#"  title=\''+value+'\' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ProcessRunStart.detail('
							+ record.data.archivesId
							+ ','
							+ record.data.isreceive
							+ ','
							+ record.data.isdraft
							+ ','
							+ datatype
							+ ')">'
							+ value
							+ '</a>';
						return str;
					}
				}],
		defaults : {
			sortable : true,
			menuDisabled : false,
			width : 100
		}
		});//end of the cm
		//最右侧面板——用于搜索引擎查询页面
		var searchPanel = new Ext.Panel({
			layout : 'form',
			title : '办公小助手',
			region : 'east',
			iconCls : 'menu-archive-issue-manage',
			collapsible : true,
			collapsed : true,
			autoScroll:true,
			height : 100,
			split : true,
			width : 240,
			items:[{
				items:[new Ext.grid.GridPanel({
							region : 'center',
							store : searchStore,
							id : 'ProcessStartOASearchGrid',
							trackMouseOver : true,
							disableSelection : false,
							loadMask : true,
							autoHeight: true,
							autoScroll:true,
							cm : cm,
							viewConfig : {
								forceFit : true,
								enableRowBody : false,
								showPreview : false
							},
							bbar : new Ext.PagingToolbar({
										pageSize : 25,
										store : searchStore,
										displayInfo : true,
										displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
										emptyMsg : "当前没有记录"
									})
		               })
		           ]
			}]
		});
		var formCenterPanel = new Ext.Panel({
			autoHeight:true,
			layout : 'form',
			border:false,
			layoutConfig : {
				pack : 'center',
				align : 'top'
			},
			items:[]
		});
		var leftPanel = new Ext.Panel({
			border:false,
			region:'center',
			layout:'anchor',
			autoScroll:true,
			bodyStyle:'padding-left:150px;padding-right:5px;padding-top:10px;',
			items:[formCenterPanel]
		});
		if(flowMap.get("outConferenceFlow")!=this.defId&&flowMap.get("carApplyFlowId")!=this.defId){
			this.items = [leftPanel,searchPanel];
		}else{
			this.items = [leftPanel];
		}
		ProcessRunStart.superclass.initComponent.call(this);
		var topPanel=this;
		var activityName=this.activityName;
		var archivesId=this.archivesId;
		var piId=this.piId;
		var applyId=this.applyId;
		var defId=this.defId;
		$request({
			url:__ctxPath+ "/flow/getProcessActivity.do",
			params:{
				activityName:activityName,
				defId:this.defId,
				runId:this.runId
			},
			success:function(response,options){
				//缺省为FormPanel
				var isFormPanel=true;
				if(response.responseText.trim().indexOf("[")==0){//兼容旧的模板写法
					if(activityName=='' || activityName=='undefined' || activityName==null){
						activityName='开始';
					}
					eval('formPanel = new Ext.FormPanel({title:"任务表单-' 
					+ activityName+'",defaults:{border:false},width:600,bodyStyle:"padding:8px 8px 8px 8px;",autoHeight:true,items:'
					+response.responseText+'});');
				}else{		
					if(response.responseText.indexOf("Ext.extend(Ext.Panel")!=-1){//为非FormPanel
						isFormPanel=false;
					}
					eval('formPanel= new ('+response.responseText + ')();');
				}
				formPanel.defId=defId;
				if(!isFormPanel){
					topPanel.getTopToolbar().removeAll();
					topPanel.getTopToolbar().setHeight(0);
				}
				//modify by:tony zhang
				//topPanel.formPanel.add(ccPanel);
				formPanel.add(msgPanel);
				formCenterPanel.removeAll(true);
				formCenterPanel.add(formPanel);
				formCenterPanel.doLayout();
			}
		});
		
	}

});

ProcessImageWindow=Ext.extend(Ext.Window,{
		constructor:function(config){
			Ext.applyIf(this,config);
			ProcessImageWindow.superclass.constructor.call(this,{
				autoScroll:true,
				iconCls:'btn-flow-chart',
				bodyStyle:'background-color:white',
				maximizable : true,
				title:'流程示意图',
				width:600,
				height:500,
				modal:true,
				layout:'fit',
				html:'<img src="'+__ctxPath+ '/jbpmImage?defId='+this.defId+ '&rand=' + Math.random()+ '"/>'
			});
		}
});
ProcessRunStart.detail=function(editId, runId, defId,dataType) {
	if(dataType==""||dataType=="0"){
	new OAOfficeDetailView({
				archivesId : editId,
				runId : runId,
				defId : defId
			}).show();
	}else if(dataType=="1"){
		new JwSentArchivesDetailForm({
			id:editId
		}).show();
	}else if(dataType=="2"){
		new JwSentDocsDetailForm({
			id:editId
		}).show();
	}else if(dataType=="3"){
		new JwReciivedDocsDetailForm({
			id:editId
		}).show();
	}else if(dataType=="4"){
		new JwRecArchivesDetailForm({
			id:editId
		}).show();
	}
}